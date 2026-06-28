package cl.dcc.appsweb.tarea4.service;

import cl.dcc.appsweb.tarea4.model.Nota;
import cl.dcc.appsweb.tarea4.repository.ActividadRepository;
import cl.dcc.appsweb.tarea4.repository.NotaRepository;
import java.util.Map;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class NotaService {

    private final NotaRepository notaRepository;
    private final ActividadRepository actividadRepository;

    public NotaService(NotaRepository notaRepository, ActividadRepository actividadRepository) {
        this.notaRepository = notaRepository;
        this.actividadRepository = actividadRepository;
    }

    @Transactional
    public Optional<Map<String, Object>> crearNota(Integer actividadId, Integer valorNota) {
        if (actividadId == null || valorNota == null || valorNota < 1 || valorNota > 7) {
            return Optional.empty();
        }
        if (!actividadRepository.existsById(actividadId)) {
            return Optional.empty();
        }

        notaRepository.save(new Nota(actividadId, valorNota));
        Double promedio = notaRepository.findPromedioByActividadId(actividadId);

        return Optional.of(Map.of(
                "ok", true,
                "actividad_id", actividadId,
                "nota_promedio", promedio
        ));
    }
}
