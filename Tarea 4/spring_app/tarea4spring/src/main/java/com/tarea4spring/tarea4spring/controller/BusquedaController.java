package com.tarea4spring.tarea4spring.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class BusquedaController {

    @Value("${app.flask-home-url}")
    private String flaskHomeUrl;

    @GetMapping("/busqueda")
    public String mostrarBusqueda(Model model) {
        model.addAttribute("flaskHomeUrl", flaskHomeUrl);
        return "searchBox";
    }
}
