const validateName = (name) => {
  if (!name) return false;
  return name.trim().length >= 4;
};

const validateEmail = (email) => {
  if (!email) return false;
  const trimmed = email.trim();
  if (trimmed.length < 5 || trimmed.length > 254) return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(trimmed);
};

const validatePhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return false;
  const lengthValid = phoneNumber.length >= 8 && phoneNumber.length <= 15;
  const re = /^[0-9]+$/;
  return lengthValid && re.test(phoneNumber);
};

const validateCargoSelect = (value) => {
  return typeof value === "string" && value.trim().length > 0;
};

const validateForm = () => {
  const myForm = document.forms["registrationForm"];
  const email = myForm["email"].value;
  const phoneNumber = myForm["phone"].value;
  const name = myForm["nombre"].value;
  const cargo = myForm["select-cargo"].value;

  const invalidInputs = [];
  let isValid = true;
  const setInvalidInput = (inputName) => {
    invalidInputs.push(inputName);
    isValid = false;
  };

  if (!validateName(name)) setInvalidInput("Nombre completo");
  if (!validateEmail(email)) setInvalidInput("Correo electrónico");
  if (!validatePhoneNumber(phoneNumber)) setInvalidInput("Teléfono");
  if (!validateCargoSelect(cargo)) setInvalidInput("Tipo de miembro");

  const validationBox = document.getElementById("val-box");
  const validationMessageElem = document.getElementById("val-msg");
  const validationListElem = document.getElementById("val-list");

  if (!isValid) {
    validationListElem.textContent = "";
    for (const item of invalidInputs) {
      const listElement = document.createElement("li");
      listElement.innerText = item;
      validationListElem.appendChild(listElement);
    }
    validationMessageElem.innerText = "Los siguientes campos son inválidos o están incompletos:";
    validationBox.style.backgroundColor = "#ffdddd";
    validationBox.style.borderLeftColor = "#f44336";
    validationBox.hidden = false;
  } else {
    myForm.style.display = "none";
    validationMessageElem.innerText = "¡Formulario válido! ¿Deseas enviarlo o volver a editar?";
    validationListElem.innerHTML = "";
    validationBox.style.backgroundColor = "#ddffdd";
    validationBox.style.borderLeftColor = "#4CAF50";

    const submitButton = document.createElement("button");
    submitButton.type = "button";
    submitButton.innerText = "Enviar (prototipo)";
    submitButton.style.marginRight = "10px";
    submitButton.addEventListener("click", () => {});

    const backButton = document.createElement("button");
    backButton.type = "button";
    backButton.innerText = "Volver a editar";
    backButton.addEventListener("click", () => {
      myForm.style.display = "block";
      validationBox.hidden = true;
      validationListElem.innerHTML = "";
    });

    validationListElem.appendChild(submitButton);
    validationListElem.appendChild(backButton);
    validationBox.hidden = false;
  }
};

document.getElementById("submit-btn").addEventListener("click", validateForm);
