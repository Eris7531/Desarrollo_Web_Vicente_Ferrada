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

const validateDescripcion = (text) => {
  if (!text) return false;
  return text.trim().length >= 4;
};

const validateSelectValue = (value) => {
  return typeof value === "string" && value.trim().length > 0;
};

const validateMediaFiles = (fileList) => {
  if (!fileList || fileList.length === 0) return false;
  if (fileList.length > 5) return false;
  for (let i = 0; i < fileList.length; i += 1) {
    const file = fileList[i];
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    if (!isImage && !isVideo) return false;
  }
  return true;
};

const validateHttpUrl = (raw) => {
  if (!raw || !raw.trim()) return false;
  let u;
  try {
    u = new URL(raw.trim());
  } catch {
    return false;
  }
  return u.protocol === "http:" || u.protocol === "https:";
};

const timeToMinutes = (timeStr) => {
  if (!timeStr || typeof timeStr !== "string") return null;
  const parts = timeStr.split(":");
  if (parts.length < 2) return null;
  const h = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
};

const validateSchedule = (form) => {
  const dias = form.querySelectorAll('input[name="dia"]:checked');
  if (dias.length === 0) return false;
  const inicio = form["hora-inicio"].value;
  const fin = form["hora-fin"].value;
  if (!inicio || !fin) return false;
  const mi = timeToMinutes(inicio);
  const mf = timeToMinutes(fin);
  if (mi === null || mf === null) return false;
  return mf > mi;
};

const validateForm = () => {
  const myForm = document.forms["myForm"];
  const name = myForm["nombre"].value;
  const email = myForm["email"].value;
  const phoneNumber = myForm["phone"].value;
  const actividadTipo = myForm["select-actividad"].value;
  const descripcion = myForm["descripcion"].value;
  const files = myForm["files"].files;
  const enlace = myForm["enlace"].value;

  const invalidInputs = [];
  let isValid = true;
  const setInvalidInput = (inputName) => {
    invalidInputs.push(inputName);
    isValid = false;
  };

  if (!validateName(name)) setInvalidInput("Nombre");
  if (!validateEmail(email)) setInvalidInput("Correo electrónico");
  if (!validatePhoneNumber(phoneNumber)) setInvalidInput("Teléfono");
  if (!validateSelectValue(actividadTipo)) setInvalidInput("Tipo de actividad");
  if (!validateDescripcion(descripcion)) setInvalidInput("Descripción");
  if (!validateSchedule(myForm)) setInvalidInput("Horario (días y horas coherentes)");
  if (!validateMediaFiles(files)) setInvalidInput("Archivos (1 a 5 imágenes o videos)");
  if (!validateHttpUrl(enlace)) setInvalidInput("Enlace (URL http o https válida)");

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
