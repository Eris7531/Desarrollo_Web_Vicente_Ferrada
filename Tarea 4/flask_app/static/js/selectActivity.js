const dataAct = {"Artística": [""],
  "Deportiva" : [""],
  "Tecnológica" : [""],
  "Social" : [""],
  "Otra" : [""]
};


const poblarActividades = () => {
    let actividadSelect = document.getElementById("select-actividad");
    for (const actividad in dataAct) {
      let option = document.createElement("option");
      option.value = actividad;
      option.text = actividad;
      actividadSelect.appendChild(option);
    }
  };

  window.onload = () => {
    poblarActividades();
    const sel = document.getElementById("select-actividad");
    if (sel) {
      const initial = sel.getAttribute("data-initial");
      if (initial) {
        sel.value = initial;
      }
    }
  };
