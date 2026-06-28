package com.tarea4spring.tarea4spring.service;

import com.tarea4spring.tarea4spring.dto.ActividadBusquedaDto;
import com.tarea4spring.tarea4spring.dto.NotaRequest;
import com.tarea4spring.tarea4spring.dto.NotaResponse;
import com.tarea4spring.tarea4spring.model.Actividad;
import com.tarea4spring.tarea4spring.model.Nota;
import com.tarea4spring.tarea4spring.repository.ActividadRepository;
import com.tarea4spring.tarea4spring.repository.NotaRepository;
import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.util.Collections;
import java.util.List;
import java.util.Locale;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BusquedaService {

    private static final int MINIMO_CARACTERES = 3;

    private final ActividadRepository actividadRepository;
    private final NotaRepository notaRepository;

    public BusquedaService(ActividadRepository actividadRepository, NotaRepository notaRepository) {
        this.actividadRepository = actividadRepository;
        this.notaRepository = notaRepository;
    }

    public List<ActividadBusquedaDto> buscarActividades(String query) {
        String termino = query == null ? "" : query.trim();
        if (termino.length() < MINIMO_CARACTERES) {
            return Collections.emptyList();
        }

        List<ActividadBusquedaDto> resultados = actividadRepository.buscarPorTermino(termino);
        for (ActividadBusquedaDto item : resultados) {
            Integer actividadId = item.getActividadId();
            Double promedio = notaRepository.promedioPorActividad(actividadId);
            int total = (int) notaRepository.countByActividad_Id(actividadId);
            item.setNotaPromedio(formatearPromedio(promedio));
            item.setTotalNotas(total);
        }
        return resultados;
    }

    @Transactional
    public NotaResponse agregarNota(Integer actividadId, NotaRequest request) {
        Actividad actividad = actividadRepository.findById(actividadId)
                .orElseThrow(() -> new IllegalArgumentException("Actividad no encontrada"));

        Nota nota = new Nota();
        nota.setActividad(actividad);
        nota.setNota(request.getNota());
        notaRepository.save(nota);

        Double promedio = notaRepository.promedioPorActividad(actividadId);
        int total = (int) notaRepository.countByActividad_Id(actividadId);
        return new NotaResponse(actividadId, formatearPromedio(promedio), total);
    }

    private String formatearPromedio(Double promedio) {
        if (promedio == null) {
            return "-";
        }
        DecimalFormatSymbols symbols = new DecimalFormatSymbols(Locale.US);
        DecimalFormat formato = new DecimalFormat("0.##", symbols);
        return formato.format(promedio);
    }
}
