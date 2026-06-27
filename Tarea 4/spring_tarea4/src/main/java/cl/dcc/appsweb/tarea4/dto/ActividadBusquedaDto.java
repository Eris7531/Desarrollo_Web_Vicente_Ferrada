package cl.dcc.appsweb.tarea4.dto;

public record ActividadBusquedaDto(
        Integer actividad_id,
        String nombreMiembro,
        String diaActividad,
        String tipoActividad,
        String comuna,
        String nombreActividad,
        Double nota_promedio
) {
}
