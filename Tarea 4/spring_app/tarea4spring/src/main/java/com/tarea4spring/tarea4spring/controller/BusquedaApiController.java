package com.tarea4spring.tarea4spring.controller;

import com.tarea4spring.tarea4spring.dto.BusquedaRequest;
import com.tarea4spring.tarea4spring.dto.BusquedaResponse;
import com.tarea4spring.tarea4spring.dto.NotaRequest;
import com.tarea4spring.tarea4spring.dto.NotaResponse;
import com.tarea4spring.tarea4spring.service.BusquedaService;
import jakarta.validation.Valid;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class BusquedaApiController {

    private final BusquedaService busquedaService;

    public BusquedaApiController(BusquedaService busquedaService) {
        this.busquedaService = busquedaService;
    }

    @PostMapping("/busqueda/resultados")
    public BusquedaResponse resultados(@RequestBody BusquedaRequest request) {
        return new BusquedaResponse(busquedaService.buscarActividades(request.getQuery()));
    }

    @PostMapping("/api/actividades/{actividadId}/notas")
    public NotaResponse agregarNota(
            @PathVariable Integer actividadId,
            @Valid @RequestBody NotaRequest request) {
        return busquedaService.agregarNota(actividadId, request);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> manejarNoEncontrado(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> manejarValidacion(MethodArgumentNotValidException ex) {
        FieldError error = ex.getBindingResult().getFieldError();
        String mensaje = error != null ? error.getDefaultMessage() : "Datos inválidos";
        return ResponseEntity.badRequest().body(Map.of("error", mensaje));
    }
}
