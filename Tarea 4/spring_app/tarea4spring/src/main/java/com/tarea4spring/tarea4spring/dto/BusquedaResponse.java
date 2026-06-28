package com.tarea4spring.tarea4spring.dto;

import java.util.List;

public class BusquedaResponse {

    private List<ActividadBusquedaDto> datos;

    public BusquedaResponse(List<ActividadBusquedaDto> datos) {
        this.datos = datos;
    }

    public List<ActividadBusquedaDto> getDatos() {
        return datos;
    }

    public void setDatos(List<ActividadBusquedaDto> datos) {
        this.datos = datos;
    }
}
