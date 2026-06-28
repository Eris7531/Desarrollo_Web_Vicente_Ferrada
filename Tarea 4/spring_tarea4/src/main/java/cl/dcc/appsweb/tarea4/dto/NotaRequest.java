package cl.dcc.appsweb.tarea4.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record NotaRequest(
        @NotNull Integer actividad_id,
        @NotNull @Min(1) @Max(7) Integer nota
) {
}
