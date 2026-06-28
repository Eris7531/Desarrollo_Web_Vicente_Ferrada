package cl.dcc.appsweb.tarea4.model;

import java.util.Map;

public final class Catalogos {

    private Catalogos() {
    }

    public static final Map<String, String> TIPO_DB_A_ETIQUETA = Map.of(
            "arte", "Artística",
            "deporte", "Deportiva",
            "tecnología", "Tecnológica",
            "social", "Social",
            "recreación", "Recreación",
            "otra", "Otra"
    );

    public static final Map<String, String> DIA_DB_A_ETIQUETA = Map.ofEntries(
            Map.entry("lunes", "Lunes"),
            Map.entry("martes", "Martes"),
            Map.entry("miercoles", "Miércoles"),
            Map.entry("jueves", "Jueves"),
            Map.entry("viernes", "Viernes"),
            Map.entry("sabado", "Sábado"),
            Map.entry("domingo", "Domingo"),
            Map.entry("miércoles", "Miércoles"),
            Map.entry("sábado", "Sábado")
    );

    public static String etiquetaTipo(String raw) {
        if (raw == null) {
            return "";
        }
        return TIPO_DB_A_ETIQUETA.getOrDefault(raw, raw);
    }

    public static String etiquetaDia(String raw) {
        if (raw == null) {
            return "";
        }
        return DIA_DB_A_ETIQUETA.getOrDefault(raw, raw);
    }
}
