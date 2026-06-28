package com.tarea4spring.tarea4spring.dto;

public class NotaResponse {

    private Integer actividadId;
    private String notaPromedio;
    private int totalNotas;

    public NotaResponse(Integer actividadId, String notaPromedio, int totalNotas) {
        this.actividadId = actividadId;
        this.notaPromedio = notaPromedio;
        this.totalNotas = totalNotas;
    }

    public Integer getActividadId() {
        return actividadId;
    }

    public void setActividadId(Integer actividadId) {
        this.actividadId = actividadId;
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
