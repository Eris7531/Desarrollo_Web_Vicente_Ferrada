const dataCargo = {"Académico (Estudiante)": [],
  "Funcionario" : []};


const poblarCargos = () => {
    let cargoSelect = document.getElementById("select-cargo");
    for (const cargo in dataCargo) {
      let option = document.createElement("option");
      option.value = cargo;
      option.text = cargo;
      cargoSelect.appendChild(option);
    }
  };

  window.onload = () => {
    poblarCargos();
  };