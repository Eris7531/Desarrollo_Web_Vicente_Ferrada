# Spring Boot — Tarea 4

Aplicación **independiente** de Flask para búsqueda y evaluación de actividades (CC5002).

## Requisitos

- Java 24
- Maven 3.9+
- MySQL con schema `tarea2` (misma BD que Flask)
- Tabla `nota` creada (`flask_app/database/tabla-nota.sql`)

## Ejecución

### 1. Flask (Tareas 1–3) — puerto 5000

```bash
cd flask_app
python app.py
```

### 2. Spring Boot (Tarea 4) — puerto 8080

```bash
cd spring_tarea4
mvn spring-boot:run
```

Abrir:

- Flask: http://localhost:5000/
- Búsqueda: http://localhost:8080/busqueda

Desde el inicio de Flask hay un enlace «Búsqueda de Actividades» que apunta a Spring Boot.

## Arquitectura

```
Request → Controller → Service → Repository (JPA) → MySQL tarea2
```

| Capa | Paquete | Rol |
|------|---------|-----|
| Controller | `controller/` | Rutas HTML (`/busqueda`) y REST (`/api/...`) |
| Service | `service/` | Lógica de búsqueda y notas |
| Repository | `repository/` | Consultas JPA |
| Model | `model/` | Entidades JPA (`Actividad`, `Miembro`, `Comuna`, `Nota`) |

## API REST (fetch desde JS)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/actividades/buscar?q=` | Búsqueda (≥ 3 caracteres) |
| POST | `/api/notas` | Body: `{ "actividad_id": N, "nota": 1-7 }` |

## Configuración

Credenciales MySQL en `src/main/resources/application.properties` (mismas que `database/db.py`).

URL de Flask para navegación: `app.flask-base-url=http://localhost:5000`
