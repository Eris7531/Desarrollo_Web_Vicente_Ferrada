package cl.dcc.appsweb.tarea4.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class BusquedaController {

    @Value("${app.flask-base-url}")
    private String flaskBaseUrl;

    @GetMapping("/busqueda")
    public String busqueda(Model model) {
        model.addAttribute("flaskHomeUrl", flaskBaseUrl + "/");
        return "busqueda";
    }
}
