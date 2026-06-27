package cl.dcc.appsweb.tarea4.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "comuna")
public class Comuna {

    @Id
    private Integer id;

    @Column(nullable = false, length = 200)
    private String nombre;

    @Column(name = "region_id", nullable = false)
    private Integer regionId;

    public Integer getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }
}
