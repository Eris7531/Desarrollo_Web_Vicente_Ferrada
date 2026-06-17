import re
from urllib.parse import urlparse

import unicodedata

import filetype

EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")

DIAS_DB_CANONICAL = frozenset(
    {"lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"}
)


def normalize_dia_for_db(raw):
    """Convierte el valor del formulario al literal ASCII del ENUM (única forma en BD)."""
    if not raw or not isinstance(raw, str):
        return None
    v = unicodedata.normalize("NFC", raw.strip())
    if v in DIAS_DB_CANONICAL:
        return v
    legacy = {
        "miércoles": "miercoles",
        "sábado": "sabado",
    }
    return legacy.get(v)


FORM_TIPO_TO_DB = {
    "Artística": "arte",
    "Deportiva": "deporte",
    "Tecnológica": "tecnología",
    "Social": "social",
    "Otra": "otra",
}

TIPOS_ACTIVIDAD_FORM = frozenset(FORM_TIPO_TO_DB.keys())

EMAIL_MAX_LEN = 80
DESCRIPCION_MAX = 500


def validate_name(name):
    if not name or not isinstance(name, str):
        return False
    return len(name.strip()) >= 4


def validate_email(email):
    if not email or not isinstance(email, str):
        return False
    trimmed = email.strip()
    if len(trimmed) < 5 or len(trimmed) > EMAIL_MAX_LEN:
        return False
    return bool(EMAIL_RE.match(trimmed))


def validate_phone(phone):
    if not phone or not isinstance(phone, str):
        return False
    phone = phone.strip()
    if len(phone) < 8 or len(phone) > 15:
        return False
    return bool(re.fullmatch(r"[0-9]+", phone))


def validate_comuna_id(raw, allowed_ids):
    try:
        cid = int(raw)
    except (TypeError, ValueError):
        return False
    return cid in allowed_ids


def validate_actividad_tipo(value):
    return value in TIPOS_ACTIVIDAD_FORM


def validate_activity_name(text):
    if not text or not isinstance(text, str):
        return False
    t = text.strip()
    return 4 <= len(t) <= 200


def validate_url_http(raw):
    if not raw or not isinstance(raw, str):
        return False
    u = urlparse(raw.strip())
    if u.scheme not in ("http", "https") or not u.netloc:
        return False
    if len(raw.strip()) > 500:
        return False
    return True


def time_to_minutes(time_str):
    if not time_str or not isinstance(time_str, str):
        return None
    parts = time_str.split(":")
    if len(parts) < 2:
        return None
    try:
        h = int(parts[0])
        m = int(parts[1])
    except ValueError:
        return None
    return h * 60 + m


def validate_single_dia(value):
    if not value or not isinstance(value, str):
        return False
    return normalize_dia_for_db(value) is not None


def validate_duration_hhmm(value):
    """Duración como HH:MM (p. ej. 01:30); mayor que 00:00 y hasta 24:00 inclusive."""
    m = time_to_minutes(value)
    if m is None:
        return False
    return 1 <= m <= 24 * 60


def normalize_duration_hhmm(value):
    m = time_to_minutes(value)
    if m is None:
        return "00:00"
    m = max(0, min(m, 24 * 60))
    return f"{m // 60:02d}:{m % 60:02d}"


def validate_media_file_storage(file_storage):
    if file_storage is None or file_storage.filename == "":
        return False
    kind = filetype.guess(file_storage.read(8192))
    file_storage.seek(0)
    if kind is None:
        return False
    return kind.mime.startswith("image/") or kind.mime.startswith("video/")


def validate_media_file_list(file_list, min_n=1, max_n=5):
    if not file_list or len(file_list) < min_n or len(file_list) > max_n:
        return False
    for f in file_list:
        if not validate_media_file_storage(f):
            return False
    return True


def sanitize_text(s, max_len=None):
    if s is None:
        return ""
    t = s.replace("\x00", "").strip()
    if max_len is not None:
        t = t[:max_len]
    return t


def merge_descripcion_con_enlace(texto_actividad, url):
    """Encaja en TEXT(500) de tarea2.sql: cuerpo + marcador + enlace."""
    marker = "\n\nEnlace: "
    base = (texto_actividad or "").strip()
    u = (url or "").strip()
    if not u:
        return base[:DESCRIPCION_MAX]
    full = f"{base}{marker}{u}"
    if len(full) <= DESCRIPCION_MAX:
        return full
    reserve = len(marker) + len(u)
    if reserve >= DESCRIPCION_MAX:
        return (base[: max(0, DESCRIPCION_MAX - reserve)] + marker + u)[:DESCRIPCION_MAX]
    return (base[: DESCRIPCION_MAX - reserve] + marker + u)[:DESCRIPCION_MAX]
