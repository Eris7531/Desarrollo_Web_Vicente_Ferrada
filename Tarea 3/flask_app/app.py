import hashlib
import os
import uuid

import filetype
from flask import Flask, abort, flash, redirect, render_template, request, url_for
from werkzeug.utils import secure_filename

from database import db as dbm
from utils import validations as V

UPLOAD_FOLDER = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "static", "uploads"
)

app = Flask(__name__)
app.secret_key = "t2_dev_secret_change_in_production"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["MAX_CONTENT_LENGTH"] = 16 * 1000 * 1000


def _save_media_file(file_storage):
    raw_name = secure_filename(file_storage.filename or "") or "archivo"
    head = hashlib.sha256(raw_name.encode("utf-8")).hexdigest()[:40]
    chunk = file_storage.read(8192)
    file_storage.seek(0)
    guessed = filetype.guess(chunk)
    if guessed is None or not guessed.extension:
        return None
    fname = f"{head}_{uuid.uuid4()}.{guessed.extension}"
    dest = os.path.join(app.config["UPLOAD_FOLDER"], fname)
    file_storage.save(dest)
    return f"uploads/{fname}", raw_name


def _form_snapshot():
    return {
        "nombre": request.form.get("nombre") or "",
        "email": request.form.get("email") or "",
        "phone": request.form.get("phone") or "",
        "comuna_id": request.form.get("comuna_id") or "",
        "select_actividad": request.form.get("select-actividad") or "",
        "descripcion": request.form.get("descripcion") or "",
        "hora_inicio": request.form.get("hora-inicio") or "",
        "duracion": request.form.get("duracion") or "",
        "enlace": request.form.get("enlace") or "",
        "dia": request.form.get("dia") or "",
    }


@app.route("/", methods=["GET"])
def home():
    ultimos = dbm.get_last_miembros(5)
    rows = []
    for m in ultimos:
        res = dbm.actividades_resumen_publico(m.id)
        tip = dbm.tipos_actividad_resumen_publico(m.id)
        rows.append(
            {
                "id": m.id,
                "nombre": m.nombre,
                "email": m.email,
                "telefono": m.telefono,
                "tipo": tip,
                "actividades": res,
            }
        )
    return render_template("home.html", ultimos=rows)


@app.route("/registro", methods=["GET", "POST"])
def registro():
    comunas = dbm.get_comunas_for_form()
    regiones = dbm.get_regions_for_form()
    allowed_comuna = {c["id"] for c in comunas}

    if request.method == "GET":
        return render_template(
            "register.html",
            comunas=comunas,
            regiones=regiones,
            errors=[],
            field_errors={},
            form=None,
        )

    snap = _form_snapshot()
    field_errors = {}
    files = request.files.getlist("files")

    nombre = V.sanitize_text(snap["nombre"], 120)
    email = V.sanitize_text(snap["email"], V.EMAIL_MAX_LEN)
    phone = V.sanitize_text(snap["phone"], 15)
    comuna_raw = snap["comuna_id"]
    act_tipo = snap["select_actividad"].strip()
    act_nombre = V.sanitize_text(snap["descripcion"], 200)
    h_ini = snap["hora_inicio"]
    dur_raw = snap["duracion"]
    enlace = V.sanitize_text(snap["enlace"], 500)
    dia_val = (snap["dia"] or "").strip()

    if not V.validate_name(nombre):
        field_errors["nombre"] = "Nombre inválido (mínimo 4 caracteres)."
    if not V.validate_email(email):
        field_errors["email"] = (
            "Correo electrónico inválido (máx. 80 caracteres, formato válido)."
        )
    if not V.validate_phone(phone):
        field_errors["phone"] = "Teléfono inválido (solo dígitos, 8–15)."
    if not V.validate_comuna_id(comuna_raw, allowed_comuna):
        field_errors["comuna_id"] = "Seleccione una comuna válida."
    if not V.validate_actividad_tipo(act_tipo):
        field_errors["select-actividad"] = "Tipo de actividad inválido."
    if not V.validate_activity_name(act_nombre):
        field_errors["descripcion"] = "Nombre de actividad inválido (4–200 caracteres)."
    if not V.validate_single_dia(dia_val):
        field_errors["dia"] = "Seleccione un día de la semana."
    if V.time_to_minutes(h_ini) is None:
        field_errors["horario"] = "Indique una hora de inicio válida (HH:MM)."
    elif not V.validate_duration_hhmm(dur_raw):
        field_errors["horario"] = (
            "Indique una duración válida (HH:MM, mayor que 00:00, máx. 24:00)."
        )
    if not V.validate_url_http(enlace):
        field_errors["enlace"] = "Enlace inválido (http o https, máx. 500 caracteres)."
    if not V.validate_media_file_list(files, min_n=1, max_n=5):
        field_errors["files"] = "Adjunte entre 1 y 5 archivos imagen o video válidos."

    if field_errors:
        return render_template(
            "register.html",
            comunas=comunas,
            regiones=regiones,
            errors=["Revise los campos marcados."],
            field_errors=field_errors,
            form=snap,
        )

    dur = V.normalize_duration_hhmm(dur_raw)
    nombre_act_db = act_nombre.strip()[:45]
    cuerpo_desc = act_nombre.strip()
    descripcion_db = V.merge_descripcion_con_enlace(cuerpo_desc, enlace.strip())

    tipo_db = V.FORM_TIPO_TO_DB[act_tipo]

    dia_db = V.normalize_dia_for_db(dia_val)
    if not dia_db:
        field_errors["dia"] = "Día no válido."
        return render_template(
            "register.html",
            comunas=comunas,
            regiones=regiones,
            errors=["Revise el día seleccionado."],
            field_errors=field_errors,
            form=snap,
        )

    actividad_rows = [
        {
            "dia": dia_db,
            "hora_inicio": h_ini[:5],
            "duracion": dur,
            "tipo": tipo_db,
            "nombre_actividad": nombre_act_db,
            "descripcion": descripcion_db,
        }
    ]

    saved_full_paths = []
    uploaded_pairs = []
    try:
        for f in files:
            info = _save_media_file(f)
            if info is None:
                field_errors["files"] = "No se pudo procesar uno de los archivos."
                break
            rel, orig_name = info
            uploaded_pairs.append((rel, orig_name))
            saved_full_paths.append(
                os.path.join(app.config["UPLOAD_FOLDER"], os.path.basename(rel))
            )

        if field_errors:
            for p in saved_full_paths:
                try:
                    os.remove(p)
                except OSError:
                    pass
            return render_template(
                "register.html",
                comunas=comunas,
                regiones=regiones,
                errors=["Error al guardar archivos."],
                field_errors=field_errors,
                form=snap,
            )

        ok, err, reutilizo = dbm.create_miembro_actividades_fotos(
            nombre=nombre.strip()[:255],
            email=email.strip()[: V.EMAIL_MAX_LEN],
            telefono=phone.strip()[:15],
            comuna_id=int(comuna_raw),
            actividad_rows=actividad_rows,
            uploaded_files=uploaded_pairs,
            static_upload_folder=UPLOAD_FOLDER,
        )
        if not ok:
            for p in saved_full_paths:
                try:
                    os.remove(p)
                except OSError:
                    pass
            return render_template(
                "register.html",
                comunas=comunas,
                regiones=regiones,
                errors=[f"Error al guardar en la base de datos: {err}"],
                field_errors={},
                form=snap,
            )

        if reutilizo:
            flash(
                "Ya existía un miembro con los mismos datos (nombre, correo, teléfono y comuna). "
                "Se agregaron las nuevas actividades sin modificar los datos del miembro.",
                "success",
            )
        else:
            flash("Registro guardado correctamente.", "success")
        return redirect(url_for("home"))
    except Exception as exc:
        for p in saved_full_paths:
            try:
                os.remove(p)
            except OSError:
                pass
        return render_template(
            "register.html",
            comunas=comunas,
            regiones=regiones,
            errors=[f"Error inesperado: {exc}"],
            field_errors={},
            form=snap,
        )


@app.route("/miembros", methods=["GET"])
def miembros():
    try:
        page = int(request.args.get("page", "1"))
    except ValueError:
        page = 1
    try:
        per_page = int(request.args.get("per_page", "5"))
    except ValueError:
        per_page = 5
    if per_page not in (3, 5, 10):
        per_page = 5
    sort_key = request.args.get("sort", "nombre-asc")
    if sort_key not in (
        "nombre-asc",
        "nombre-desc",
        "email-asc",
        "email-desc",
        "telefono-asc",
        "telefono-desc",
    ):
        sort_key = "nombre-asc"

    data = dbm.get_miembros_page(
        page=page,
        per_page=per_page,
        sort_key=sort_key,
    )
    return render_template(
        "member_list.html",
        data=data,
        sort_key=sort_key,
        per_page=per_page,
    )


ACTIVIDADES_DETALLE_PER_PAGE = 3


@app.route("/miembros/<int:mid>", methods=["GET"])
def miembro_detalle(mid):
    try:
        act_page = int(request.args.get("act_page", "1"))
    except ValueError:
        act_page = 1
    info = dbm.get_miembro_detalle(
        mid,
        actividades_page=act_page,
        actividades_per_page=ACTIVIDADES_DETALLE_PER_PAGE,
    )
    if not info:
        abort(404)
    return render_template("member_detail.html", m=info)


@app.route("/miembros/<int:mid>/actividad/<int:aid>/eliminar", methods=["POST"])
def eliminar_actividad(mid, aid):
    try:
        act_page = int(request.form.get("act_page", "1"))
    except ValueError:
        act_page = 1
    ok, err, restantes = dbm.delete_actividad_de_miembro(
        mid, aid, app.config["UPLOAD_FOLDER"]
    )
    if not ok:
        flash(err or "No se pudo eliminar la actividad.", "error")
        return redirect(url_for("miembro_detalle", mid=mid, act_page=act_page))
    flash("Actividad eliminada correctamente.", "success")
    if restantes is None or restantes == 0:
        redirect_page = 1
    else:
        act_pages = max(
            1,
            (restantes + ACTIVIDADES_DETALLE_PER_PAGE - 1)
            // ACTIVIDADES_DETALLE_PER_PAGE,
        )
        redirect_page = min(act_page, act_pages)
    return redirect(url_for("miembro_detalle", mid=mid, act_page=redirect_page))


@app.route("/estadisticas", methods=["GET"])
def estadisticas():
    chart_stats = dbm.get_chart_stats_payload()
    return render_template("graph_stats.html", chart_stats=chart_stats)

# Queremos crear una función para obtener los datos de la base de datos, específicamente para obtener los datos dentro de la tabala
# 'comentario' dentro del schema 'tarea2'.
#@app.route("/miembros/comentario", methods=["GET"])
#def displayComentario():
#    return "ok"
# Comentado por ahora: La función displayComentarios será reemplazada por los métodos 'fetch' o 'XMLHttpRequest' dentro del 
# archivo JavaScript 'readComments.js', de modo de obtener los datos de la base de datos sin necesidad de recargar la página,
# cumpliendo lo pedido por el enunciado.
# Se repetirá el uso de esta lógica para obtener los datos de los miembros que subieron actividades junto a su región / comuna y 
# tipo de actividad, para la creación de graficos de linea, torta y barra. Estos métodos de obtener la información de la base de 
# datos usando 'fetch' o 'XMLHttpRequest' serán implementados dentro del archivo 'graphData.js' creado en la tarea 2.


# En esta función queremos tomar un comentario ingreado en el formulario 'comment_form.html' y guardarlo en la base de datos,
# específicamente en la tabla 'comentario' dentro del schema 'tarea2'. Para esto, debemos tomar el comentario ingresado, el id del 
# miembro, y la fecha actual (al momento de hacer click sobre el botón de enviar comentario) y guardarlos en la base de datos.
#@app.route("/miembros/comentario/subirComentario", methods=["POST"])
#def subirComentario():
#    return "ok"
# No seguro de si se mantendrá éste método o también se moverá a los archivos js.

@app.route("/api/comentarios/<int:aid>", methods=["GET"])
def get_comentarios_actividad(aid):
    """Retorna comentarios para una actividad (GET asincrónico)"""
    comentarios = dbm.get_comments_for_actividad_json(aid)
    return {"comentarios": comentarios}

@app.route("/api/comentarios", methods=["POST"])
def crear_comentario():
    """Crea un nuevo comentario (POST asincrónico)"""
    data = request.get_json()
    nombre = data.get("nombre")
    texto = data.get("texto")
    actividad_id = data.get("actividad_id")
    
    ok, datos, error = dbm.create_comentario(nombre, texto, actividad_id)
    
    if not ok:
        return {"ok": False, "error": error}, 400
    return {"ok": True, "comentario": datos}, 201

if __name__ == "__main__":
    app.run(debug=True)
