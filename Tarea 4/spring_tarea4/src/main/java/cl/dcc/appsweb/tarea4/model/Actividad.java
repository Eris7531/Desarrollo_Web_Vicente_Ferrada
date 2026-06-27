package cl.dcc.appsweb.tarea4.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "actividad")
public class Actividad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "miembro_id", nullable = false, insertable = false, updatable = false)
    private Integer miembroId;

    @Column(nullable = false, length = 20)
    private String dia;

    @Column(nullable = false, length = 20)
    private String tipo;

    @Column(nullable = false, length = 45)
    private String nombre;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "miembro_id", nullable = false)
    private Miembro miembro;

    @OneToMany(mappedBy = "actividad")
    private List<Nota> notas = new ArrayList<>();

    public Integer getId() {
        return id;
    }

    public String getDia() {
        return dia;
    }

    public String getTipo() {
        return tipo;
    }

    public String getNombre() {
        return nombre;
    }

    public Miembro getMiembro() {
        return miembro;
    }
}
