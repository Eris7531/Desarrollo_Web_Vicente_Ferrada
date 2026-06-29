package com.tarea4spring.tarea4spring.repository;

import com.tarea4spring.tarea4spring.dto.ActividadBusquedaDto;
import com.tarea4spring.tarea4spring.model.Actividad;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ActividadRepository extends JpaRepository<Actividad, Integer> {

    @Query("""
            SELECT new com.tarea4spring.tarea4spring.dto.ActividadBusquedaDto(
                a.id,
                a.nombre,
                a.dia,
                a.tipo,
                m.id,
                m.nombre,
                c.nombre
            )
            FROM Actividad a
            JOIN a.miembro m
            JOIN m.comuna c
            WHERE LOWER(a.nombre) LIKE LOWER(CONCAT('%', :termino, '%'))
               OR LOWER(c.nombre) LIKE LOWER(CONCAT('%', :termino, '%'))
               OR LOWER(a.tipo) LIKE LOWER(CONCAT('%', :termino, '%'))
            """)
    List<ActividadBusquedaDto> buscarPorTermino(@Param("termino") String termino);
}
