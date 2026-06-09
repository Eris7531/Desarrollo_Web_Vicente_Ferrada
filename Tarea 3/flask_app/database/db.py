from datetime import datetime, timezone
import os
import unicodedata

from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    create_engine,
    func,
)
from sqlalchemy.orm import declarative_base, relationship, sessionmaker

DB_NAME = "tarea2"
DB_USERNAME = "cc5002"
DB_PASSWORD = "programacionweb"
DB_HOST = "localhost"
DB_PORT = 3306

DATABASE_URL = (
    f"mysql+pymysql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)

engine = create_engine(
    DATABASE_URL,
    echo=False,
    future=True,
    connect_args={"charset": "utf8mb4"},
)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

Base = declarative_base()

# Literales del ENUM `actividad.dia` en database/tarea2.sql (solo ASCII; ORM usa String).
_dia_enum = (
    "lunes",
    "martes",
    "miercoles",
    "jueves",
    "viernes",
    "sabado",
    "domingo",
)
_tipo_act_enum = ("arte", "deporte", "tecnología", "social", "recreación", "otra")

_ENLACE_MARKER = "\n\nEnlace: "


def _nfc_str(value):
    """Normaliza a NFC (útil para `tipo` con tilde; `dia` va en ASCII desde la app)."""
    if value is None:
        return None
    s = value if isinstance(value, str) else str(value)
    return unicodedata.normalize("NFC", s)


TIPO_DB_A_ETIQUETA = {
    "arte": "Artística",
    "deporte": "Deportiva",
    "tecnología": "Tecnológica",
    "social": "Social",
    "recreación": "Recreación",
    "otra": "Otra",
}

DIA_DB_A_ETIQUETA = {
    "lunes": "Lunes",
    "martes": "Martes",
    "miercoles": "Miércoles",
    "jueves": "Jueves",
    "viernes": "Viernes",
    "sabado": "Sábado",
    "domingo": "Domingo",
    # Filas antiguas si aún existieran con ENUM acentuado:
    "miércoles": "Miércoles",
    "sábado": "Sábado",
}


def _split_descripcion_enlace(raw):
    if not raw:
        return "", ""
    s = raw if isinstance(raw, str) else str(raw)
    if _ENLACE_MARKER in s:
        a, b = s.split(_ENLACE_MARKER, 1)
        return a.strip(), b.strip()
    return s.strip(), ""


class Region(Base):
    __tablename__ = "region"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(200), nullable=False)

    comunas = relationship("Comuna", back_populates="region")


class Comuna(Base):
    __tablename__ = "comuna"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(200), nullable=False)
    region_id = Column(Integer, ForeignKey("region.id"), nullable=False)

    region = relationship("Region", back_populates="comunas")
    miembros = relationship("Miembro", back_populates="comuna")


class Miembro(Base):
    __tablename__ = "miembro"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(255), nullable=False)
    email = Column(String(80), nullable=False)
    telefono = Column(String(15), nullable=False)
    fecha_registro = Column(DateTime, nullable=False, default=datetime.utcnow)
    comuna_id = Column(Integer, ForeignKey("comuna.id"), nullable=False)

    comuna = relationship("Comuna", back_populates="miembros")
    actividades = relationship(
        "Actividad",
        back_populates="miembro",
        cascade="all, delete-orphan",
    )


class Actividad(Base):
    __tablename__ = "actividad"

    id = Column(Integer, primary_key=True, autoincrement=True)
    miembro_id = Column(Integer, ForeignKey("miembro.id"), nullable=False)
    # String en el ORM: la columna en MySQL sigue siendo ENUM (tarea2.sql). Así se evita el
    # Enum de SQLAlchemy/Python con literales acentuados, que a veces provoca 1265 al insertar.
    dia = Column(String(20), nullable=False)
    hora_inicio = Column(String(5), nullable=False)
    duracion = Column(String(5), nullable=False)
    tipo = Column(String(20), nullable=False)
    nombre = Column(String(45), nullable=False)
    descripcion = Column(Text, nullable=True)

    miembro = relationship("Miembro", back_populates="actividades")
    fotos = relationship(
        "Foto",
        back_populates="actividad",
        cascade="all, delete-orphan",
    )
    
    # Inicio agregados para tarea 3: Parte 1.
    
    comentarios = relationship(
        "Comentario",
        back_populates="actividad",
        cascade="all, delete-orphan",
    )

    # Fin agregados para tarea 3: Parte 1.

class Foto(Base):
    __tablename__ = "foto"

    id = Column(Integer, primary_key=True, autoincrement=True)
    ruta_archivo = Column(String(300), nullable=False)
    nombre_archivo = Column(String(300), nullable=False)
    actividad_id = Column(Integer, ForeignKey("actividad.id"), nullable=False)

    actividad = relationship("Actividad", back_populates="fotos")
    
    
# Inicio agregados tarea 3: Parte 2.

class Comentario(Base):
    __tablename__ = "comentario"

    id = Column(Integer, primary_key=True, autoincrement=True)
    comentarista_nombre = Column(String(255), nullable=False)
    comentario_texto = Column(Text, nullable=False)
    fecha_comentario = Column(DateTime, nullable=False, default=datetime.utcnow)
    actividad_id = Column(Integer, ForeignKey("actividad.id"), nullable=False)

    actividad = relationship("Actividad", back_populates="comentarios")


def get_comments_for_actividad_json(actividad_id):
    
    # Retorna comentarios de una actividad en formato JSON-serializable para poder usar
    # adecuadamente dentro de JavaScript.
    # Esto con objetivo de hacer uso de las funciones fetch/XHR como pide el enunciado.
    
    session = SessionLocal()
    try:
        comentarios = (
            session.query(Comentario)
            .filter(Comentario.actividad_id == actividad_id)
            .order_by(Comentario.fecha_comentario.desc())
            .all()
        )
        return [
            {
                "id": c.id,
                "nombre": c.comentarista_nombre,
                "texto": c.comentario_texto,
                "fecha": c.fecha_comentario.isoformat() if c.fecha_comentario else None,
                "actividad_id": c.actividad_id,
            }
            for c in comentarios
        ]
    finally:
        session.close()


def create_comentario(comentarista_nombre, comentario_texto, actividad_id):
    session = SessionLocal()
    try:
        nombre_limpio = (comentarista_nombre or "").strip()
        if len(nombre_limpio) < 3 or len(nombre_limpio) > 255:
            return False, None, "Nombre debe tener entre 3 y 255 caracteres."

        texto_limpio = (comentario_texto or "").strip()
        if len(texto_limpio) < 5:
            return False, None, "Comentario debe tener al menos 5 caracteres."

        act = session.query(Actividad).filter_by(id=actividad_id).first()
        if not act:
            return False, None, "Actividad no encontrada."

        nuevo_comentario = Comentario(
            comentarista_nombre=nombre_limpio,
            comentario_texto=texto_limpio,
            actividad_id=actividad_id,
            fecha_comentario=datetime.utcnow,
        )
        session.add(nuevo_comentario)
        session.commit()

        datos_comentario = {
            "id": nuevo_comentario.id,
            "nombre": nuevo_comentario.comentarista_nombre,
            "texto": nuevo_comentario.comentario_texto,
            "fecha": nuevo_comentario.fecha_comentario.isoformat(),
            "actividad_id": nuevo_comentario.actividad_id,
        }
        return True, datos_comentario, None
    except Exception as exc:
        session.rollback()
        return False, None, str(exc)
    finally:
        session.close()
            
# Fin agregados tarea 3: Parte 2.


def get_regions_for_form():
    session = SessionLocal()
    try:
        regs = session.query(Region).order_by(Region.nombre).all()
        return [{"id": r.id, "nombre": r.nombre} for r in regs]
    finally:
        session.close()


def get_comunas_for_form():
    session = SessionLocal()
    try:
        rows = (
            session.query(Comuna, Region.nombre)
            .join(Region, Comuna.region_id == Region.id)
            .order_by(Region.nombre, Comuna.nombre)
            .all()
        )
        return [
            {
                "id": c.id,
                "nombre": c.nombre,
                "region": rname,
                "region_id": c.region_id,
            }
            for c, rname in rows
        ]
    finally:
        session.close()


_CHART_COLORS = (
    "#2e7d32",
    "#1565c0",
    "#6a1b9a",
    "#c62828",
    "#ef6c00",
    "#00838f",
    "#5d4037",
    "#455a64",
    "#6d4c41",
    "#283593",
)


def get_chart_stats_payload():
    """Datos para gráficos en /estadisticas (desde tarea2)."""
    session = SessionLocal()
    try:
        miembros_rows = (
            session.query(Region.nombre, func.count(Miembro.id))
            .select_from(Miembro)
            .join(Comuna, Miembro.comuna_id == Comuna.id)
            .join(Region, Comuna.region_id == Region.id)
            .group_by(Region.id, Region.nombre)
            .order_by(Region.nombre)
            .all()
        )
        miembros_chart = []
        for i, (nombre, cnt) in enumerate(miembros_rows):
            miembros_chart.append(
                {
                    "etiqueta": nombre or "Sin región",
                    "valor": int(cnt or 0),
                    "color": _CHART_COLORS[i % len(_CHART_COLORS)],
                }
            )

        act_rows = (
            session.query(Actividad.tipo, func.count(Actividad.id))
            .group_by(Actividad.tipo)
            .all()
        )
        act_chart = []
        for i, (tipo_enum, cnt) in enumerate(act_rows):
            raw = tipo_enum.value if hasattr(tipo_enum, "value") else str(tipo_enum)
            label = TIPO_DB_A_ETIQUETA.get(raw, raw)
            act_chart.append(
                {
                    "etiqueta": label,
                    "valor": int(cnt or 0),
                    "color": _CHART_COLORS[i % len(_CHART_COLORS)],
                }
            )
        act_chart.sort(key=lambda x: -x["valor"])

        return {"miembros": miembros_chart, "actividades": act_chart}
    finally:
        session.close()


def get_last_miembros(limit=5):
    session = SessionLocal()
    try:
        return (
            session.query(Miembro)
            .order_by(Miembro.fecha_registro.desc())
            .limit(limit)
            .all()
        )
    finally:
        session.close()


def actividades_resumen_publico(miembro_id):
    session = SessionLocal()
    try:
        return _actividades_resumen(session, miembro_id)
    finally:
        session.close()


def tipos_actividad_resumen_publico(miembro_id):
    session = SessionLocal()
    try:
        return _tipos_actividad_resumen(session, miembro_id)
    finally:
        session.close()


def _tipos_actividad_resumen(session, miembro_id):
    acts = (
        session.query(Actividad)
        .filter(Actividad.miembro_id == miembro_id)
        .order_by(Actividad.id)
        .all()
    )
    if not acts:
        return "—"
    seen = []
    for a in acts:
        raw = a.tipo.value if hasattr(a.tipo, "value") else str(a.tipo)
        lab = TIPO_DB_A_ETIQUETA.get(raw, raw)
        if lab not in seen:
            seen.append(lab)
    return ", ".join(seen) if seen else "—"


def _actividades_resumen(session, miembro_id):
    acts = (
        session.query(Actividad)
        .filter(Actividad.miembro_id == miembro_id)
        .order_by(Actividad.id)
        .all()
    )
    if not acts:
        return "—"
    nombres = []
    for a in acts:
        label = (a.nombre or "").strip()
        if label and label not in nombres:
            nombres.append(label)
    return ", ".join(nombres) if nombres else "—"


def get_miembros_page(
    page=1,
    per_page=5,
    sort_key="nombre-asc",
):
    session = SessionLocal()
    try:
        base = session.query(Miembro)
        total = base.count()

        field, direction = sort_key.split("-", 1)
        col = {
            "nombre": Miembro.nombre,
            "email": Miembro.email,
            "telefono": Miembro.telefono,
        }.get(field, Miembro.nombre)

        q = base
        if direction == "desc":
            q = q.order_by(col.desc(), Miembro.id.desc())
        else:
            q = q.order_by(col.asc(), Miembro.id.asc())

        if total == 0:
            return {
                "rows": [],
                "total": 0,
                "page": 1,
                "per_page": per_page,
                "total_pages": 0,
            }

        total_pages = max(1, (total + per_page - 1) // per_page)
        page = max(1, min(int(page), total_pages))
        offset = (page - 1) * per_page
        rows = q.offset(offset).limit(per_page).all()

        out = []
        for m in rows:
            out.append(
                {
                    "id": m.id,
                    "nombre": m.nombre,
                    "email": m.email,
                    "telefono": m.telefono,
                    "tipo": _tipos_actividad_resumen(session, m.id),
                    "actividades": _actividades_resumen(session, m.id),
                }
            )
        return {
            "rows": out,
            "total": total,
            "page": page,
            "per_page": per_page,
            "total_pages": total_pages,
        }
    finally:
        session.close()


def get_miembro_detalle(miembro_id, actividades_page=1, actividades_per_page=3):
    session = SessionLocal()
    try:
        m = session.query(Miembro).filter_by(id=miembro_id).first()
        if not m:
            return None
        comuna = session.query(Comuna).filter_by(id=m.comuna_id).first()
        region_nombre = None
        if comuna:
            reg = session.query(Region).filter_by(id=comuna.region_id).first()
            region_nombre = reg.nombre if reg else None

        total_act = (
            session.query(func.count(Actividad.id))
            .filter(Actividad.miembro_id == m.id)
            .scalar()
        )
        total_act = int(total_act or 0)
        if total_act == 0:
            act_pages = 1
            act_page = 1
            offset = 0
        else:
            act_pages = max(
                1, (total_act + actividades_per_page - 1) // actividades_per_page
            )
            act_page = max(1, min(int(actividades_page), act_pages))
            offset = (act_page - 1) * actividades_per_page

        acts = (
            session.query(Actividad)
            .filter(Actividad.miembro_id == m.id)
            .order_by(Actividad.id)
            .offset(offset)
            .limit(actividades_per_page)
            .all()
        )
        act_out = []
        for a in acts:
            fotos = session.query(Foto).filter(Foto.actividad_id == a.id).all()
            raw_dia = a.dia.value if hasattr(a.dia, "value") else str(a.dia)
            raw_tipo = a.tipo.value if hasattr(a.tipo, "value") else str(a.tipo)
            desc_body, enlace = _split_descripcion_enlace(a.descripcion)
            act_out.append(
                {
                    "id": a.id,
                    "dia": DIA_DB_A_ETIQUETA.get(raw_dia, raw_dia),
                    "hora_inicio": a.hora_inicio,
                    "duracion": a.duracion,
                    "tipo": TIPO_DB_A_ETIQUETA.get(raw_tipo, raw_tipo),
                    "nombre": a.nombre,
                    "descripcion": desc_body,
                    "enlace": enlace,
                    "fotos": [
                        {"ruta": f.ruta_archivo, "nombre": f.nombre_archivo}
                        for f in fotos
                    ],
                }
            )
        return {
            "id": m.id,
            "nombre": m.nombre,
            "email": m.email,
            "telefono": m.telefono,
            "fecha_registro": m.fecha_registro,
            "comuna": comuna.nombre if comuna else "",
            "region": region_nombre or "",
            "actividades": act_out,
            "actividades_total": total_act,
            "actividades_page": act_page,
            "actividades_pages": act_pages,
            "actividades_per_page": actividades_per_page,
        }
    finally:
        session.close()


def delete_actividad_de_miembro(miembro_id, actividad_id, upload_folder):
    """
    Elimina una actividad y sus filas en `foto`.
    El miembro no se elimina aunque quede sin actividades.
    Retorna (ok, mensaje_error_o_None, actividades_restantes).
    """
    session = SessionLocal()
    paths_disk = []
    try:
        a = (
            session.query(Actividad)
            .filter(
                Actividad.id == actividad_id,
                Actividad.miembro_id == miembro_id,
            )
            .first()
        )
        if not a:
            return False, "Actividad no encontrada o no pertenece a este miembro.", None

        fotos = session.query(Foto).filter(Foto.actividad_id == a.id).all()
        for f in fotos:
            rel = f.ruta_archivo or ""
            if rel.startswith("uploads/"):
                paths_disk.append(
                    os.path.join(upload_folder, os.path.basename(rel))
                )
            session.delete(f)

        session.delete(a)
        session.commit()

        for fp in paths_disk:
            try:
                if os.path.isfile(fp):
                    os.remove(fp)
            except OSError:
                pass

        restantes = (
            session.query(func.count(Actividad.id))
            .filter(Actividad.miembro_id == miembro_id)
            .scalar()
        )
        return True, None, int(restantes or 0)
    except Exception as exc:
        session.rollback()
        return False, str(exc), None
    finally:
        session.close()


def _find_miembro_misma_ficha(session, nombre, email, telefono, comuna_id):
    return (
        session.query(Miembro)
        .filter(
            Miembro.nombre == nombre,
            Miembro.email == email,
            Miembro.telefono == telefono,
            Miembro.comuna_id == comuna_id,
        )
        .first()
    )


def create_miembro_actividades_fotos(
    nombre,
    email,
    telefono,
    comuna_id,
    actividad_rows,
    uploaded_files,
    static_upload_folder,
):

    session = SessionLocal()
    try:
        existente = _find_miembro_misma_ficha(
            session, nombre, email, telefono, comuna_id
        )
        reutilizo = False
        if existente:
            m = existente
            reutilizo = True
        else:
            m = Miembro(
                nombre=nombre,
                email=email,
                telefono=telefono,
                fecha_registro=datetime.utcnow(),
                comuna_id=comuna_id,
            )
            session.add(m)
        session.flush()

        created_activities = []
        for row in actividad_rows:
            a = Actividad(
                miembro_id=m.id,
                dia=_nfc_str(row["dia"]),
                hora_inicio=row["hora_inicio"],
                duracion=row["duracion"],
                tipo=_nfc_str(row["tipo"]),
                nombre=row["nombre_actividad"],
                descripcion=row["descripcion"],
            )
            session.add(a)
            session.flush()
            created_activities.append(a)

        if not created_activities:
            session.rollback()
            return False, "No se pudo crear actividades.", False

        target_actividad_id = created_activities[0].id
        for ruta, nombre_archivo in uploaded_files:
            f = Foto(
                ruta_archivo=ruta,
                nombre_archivo=nombre_archivo,
                actividad_id=target_actividad_id,
            )
            session.add(f)

        session.commit()
        return True, None, reutilizo
    except Exception as exc:
        session.rollback()
        return False, str(exc), False
    finally:
        session.close()
