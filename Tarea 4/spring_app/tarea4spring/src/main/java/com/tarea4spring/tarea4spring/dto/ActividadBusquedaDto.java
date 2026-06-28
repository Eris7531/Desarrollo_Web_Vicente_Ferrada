package com.tarea4spring.tarea4spring.dto;

public class ActividadBusquedaDto {

    private Integer actividadId;
    private String nombreActividad;
    private String descripcion;
    private String dia;
    private String tipo;
    private Integer miembroId;
    private String nombreMiembro;
    private String nombreComuna;
    private String notaPromedio;
    private int totalNotas;

    public ActividadBusquedaDto(
            Integer actividadId,
            String nombreActividad,
            String descripcion,
            String dia,
            String tipo,
            Integer miembroId,
            String nombreMiembro,
            String nombreComuna) {
        this.actividadId = actividadId;
        this.nombreActividad = nombreActividad;
        this.descripcion = descripcion;
        this.dia = dia;
        this.tipo = tipo;
        this.miembroId = miembroId;
        this.nombreMiembro = nombreMiembro;
        this.nombreComuna = nombreComuna;
        this.notaPromedio = "-";
        this.totalNotas = 0;
    }

    public Integer getActividadId() {
        return actividadId;
    }

    public void setActividadId(Integer actividadId) {
        this.actividadId = actividadId;
    }

    public String getNombreActividad() {
        return nombreActividad;
    }

    public void setNombreActividad(String nombreActividad) {
        this.nombreActividad = nombreActividad;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getDia() {
        return dia;
    }

    public void setDia(String dia) {
        this.dia = dia;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public Integer getMiembroId() {
        return miembroId;
    }

    public void setMiembroId(Integer miembroId) {
        this.miembroId = miembroId;
    }

    public String getNombreMiembro() {
        return nombreMiembro;
    }

    public void setNombreMiembro(String nombreMiembro) {
        this.nombreMiembro = nombreMiembro;
    }

    public String getNombreComuna() {
        return nombreComuna;
    }

    public void setNombreComuna(String nombreComuna) {
        this.nombreComuna = nombreComuna;
    }

    public String getNotaPromedio() {
        return notaPromedio;
    }

    public void setNotaPromedio(String notaPromedio) {
        this.notaPromedio = notaPromedio;
    }

    public int getTotalNotas() {
        return totalNotas;
    }

    public void setTotalNotas(int totalNotas) {
        this.totalNotas = totalNotas;
    }
}
