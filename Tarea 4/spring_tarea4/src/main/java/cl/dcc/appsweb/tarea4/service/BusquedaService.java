package cl.dcc.appsweb.tarea4.service;

import cl.dcc.appsweb.tarea4.dto.ActividadBusquedaDto;
import cl.dcc.appsweb.tarea4.model.Actividad;
import cl.dcc.appsweb.tarea4.model.Catalogos;
import cl.dcc.appsweb.tarea4.repository.ActividadRepository;
import cl.dcc.appsweb.tarea4.repository.NotaRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BusquedaService {

    private final ActividadRepository actividadRepository;
    private final NotaRepository notaRepository;

    public BusquedaService(ActividadRepository actividadRepository, NotaRepository notaRepository) {
        this.actividadRepository = actividadRepository;
        this.notaRepository = notaRepository;
    }

    @Transactional(readOnly = true)
    public List<ActividadBusquedaDto> buscar(String termino) {
        String q = termino == null ? "" : termino.strip();
        if (q.length() < 3) {
            return List.of();
        }

        return actividadRepository.buscarPorTermino(q).stream()
                .map(this::toDto)
                .toList();
    }

    private ActividadBusquedaDto toDto(Actividad actividad) {
        Double promedio = notaRepository.findPromedioByActividadId(actividad.getId());
        return new ActividadBusquedaDto(
                actividad.getId(),
                actividad.getMiembro().getNombre(),
                Catalogos.etiquetaDia(actividad.getDia()),
                Catalogos.etiquetaTipo(actividad.getTipo()),
                actividad.getMiembro().getComuna().getNombre(),
                actividad.getNombre(),
                promedio
        );
    }
}
