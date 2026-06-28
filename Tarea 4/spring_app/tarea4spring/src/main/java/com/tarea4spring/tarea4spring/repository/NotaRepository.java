package com.tarea4spring.tarea4spring.repository;

import com.tarea4spring.tarea4spring.model.Nota;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface NotaRepository extends JpaRepository<Nota, Integer> {

    @Query("SELECT AVG(n.nota) FROM Nota n WHERE n.actividad.id = :actividadId")
    Double promedioPorActividad(@Param("actividadId") Integer actividadId);

    long countByActividad_Id(Integer actividadId);
}
