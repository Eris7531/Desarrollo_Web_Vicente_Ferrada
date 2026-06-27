package cl.dcc.appsweb.tarea4.repository;

import cl.dcc.appsweb.tarea4.model.Nota;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface NotaRepository extends JpaRepository<Nota, Integer> {

    @Query("SELECT AVG(n.nota) FROM Nota n WHERE n.actividadId = :actividadId")
    Double findPromedioByActividadId(@Param("actividadId") Integer actividadId);
}
