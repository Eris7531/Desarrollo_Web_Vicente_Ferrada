package com.tarea4spring.tarea4spring.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class BusquedaController {

    @Value("${app.flask-port:5000}")
    private int flaskPort;

    @Value("${app.flask-host:}")
    private String flaskHostOverride;

    @GetMapping("/busqueda")
    public String mostrarBusqueda(Model model, HttpServletRequest request) {
        String host = StringUtils.hasText(flaskHostOverride)
                ? flaskHostOverride.trim()
                : request.getServerName();
        String flaskBase = "http://" + host + ":" + flaskPort;
        model.addAttribute("flaskHomeUrl", flaskBase + "/");
        model.addAttribute("flaskMiembrosBaseUrl", flaskBase + "/miembros/");
        return "searchBox";
    }
}
