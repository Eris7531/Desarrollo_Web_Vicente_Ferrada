package cl.dcc.appsweb.tarea4.repository;

import cl.dcc.appsweb.tarea4.model.Actividad;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ActividadRepository extends JpaRepository<Actividad, Integer> {

    @Query("""
            SELECT DISTINCT a FROM Actividad a
            JOIN FETCH a.miembro m
            JOIN FETCH m.comuna c
            WHERE LOWER(a.nombre) LIKE LOWER(CONCAT('%', :q, '%'))
               OR LOWER(a.tipo) LIKE LOWER(CONCAT('%', :q, '%'))
               OR LOWER(c.nombre) LIKE LOWER(CONCAT('%', :q, '%'))
            ORDER BY a.nombre ASC
            """)
    List<Actividad> buscarPorTermino(@Param("q") String q);
}
