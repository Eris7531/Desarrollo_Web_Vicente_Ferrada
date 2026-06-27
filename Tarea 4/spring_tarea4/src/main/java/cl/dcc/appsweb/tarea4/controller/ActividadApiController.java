package cl.dcc.appsweb.tarea4.controller;

import cl.dcc.appsweb.tarea4.dto.NotaRequest;
import cl.dcc.appsweb.tarea4.service.BusquedaService;
import cl.dcc.appsweb.tarea4.service.NotaService;
import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ActividadApiController {

    private final BusquedaService busquedaService;
    private final NotaService notaService;

    public ActividadApiController(BusquedaService busquedaService, NotaService notaService) {
        this.busquedaService = busquedaService;
        this.notaService = notaService;
    }

    @GetMapping("/actividades/buscar")
    public ResponseEntity<Map<String, Object>> buscar(@RequestParam(name = "q", defaultValue = "") String q) {
        String query = q == null ? "" : q.strip();
        if (query.length() < 3) {
            return ResponseEntity.badRequest().body(Map.of(
                    "ok", false,
                    "error", "Ingrese al menos 3 caracteres"
            ));
        }

        return ResponseEntity.ok(Map.of(
                "ok", true,
                "query", query,
                "actividades", busquedaService.buscar(query)
        ));
    }

    @PostMapping("/notas")
    public ResponseEntity<Map<String, Object>> crearNota(@Valid @RequestBody NotaRequest request) {
        return notaService.crearNota(request.actividad_id(), request.nota())
                .map(body -> ResponseEntity.status(HttpStatus.CREATED).body(body))
                .orElseGet(() -> ResponseEntity.badRequest().body(Map.of(
                        "ok", false,
                        "error", "No se pudo guardar la nota. Verifique actividad_id y valor (1–7)."
                )));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .findFirst()
                .orElse("Datos inválidos");
        Map<String, Object> body = new HashMap<>();
        body.put("ok", false);
        body.put("error", message);
        return ResponseEntity.badRequest().body(body);
    }
}
