const validateName = (name) => {
  if (!name) return false;
  return name.trim().length >= 4;
};

const validateEmail = (email) => {
  if (!email) return false;
  const trimmed = email.trim();
  if (trimmed.length < 5 || trimmed.length > 80) return false;
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
  const dia = form.querySelector("#dia-elegido");
  if (!dia || !dia.value || !dia.value.trim()) return false;
  const inicio = form["hora-inicio"].value;
  const dur = form["duracion"].value;
  if (!inicio || !dur) return false;
  if (timeToMinutes(inicio) === null) return false;
  const dm = timeToMinutes(dur);
  if (dm === null) return false;
  return dm >= 1 && dm <= 24 * 60;
};

const showClientErrors = (invalidInputs) => {
  const validationBox = document.getElementById("val-box");
  const validationMessageElem = document.getElementById("val-msg");
  const validationListElem = document.getElementById("val-list");
  validationListElem.textContent = "";
  for (const item of invalidInputs) {
    const listElement = document.createElement("li");
    listElement.innerText = item;
    validationListElem.appendChild(listElement);
  }
  validationMessageElem.innerText =
    "Los siguientes campos son inválidos o están incompletos:";
  validationBox.style.backgroundColor = "#ffdddd";
  validationBox.style.borderLeftColor = "#f44336";
  validationBox.hidden = false;
};

const validateCombinedForm = () => {
  const myForm = document.forms["combinedForm"];
  const name = myForm["nombre"].value;
  const email = myForm["email"].value;
  const phoneNumber = myForm["phone"].value;
  const comuna = myForm["comuna_id"].value;
  const actividadTipo = myForm["select-actividad"].value;
  const descripcion = myForm["descripcion"].value;
  const files = myForm["files"].files;
  const enlace = myForm["enlace"].value;

  const invalidInputs = [];

  if (!validateName(name)) invalidInputs.push("Nombre completo");
  if (!validateEmail(email)) invalidInputs.push("Correo electrónico");
  if (!validatePhoneNumber(phoneNumber)) invalidInputs.push("Teléfono");
  if (!validateSelectValue(comuna)) invalidInputs.push("Comuna");
  if (!validateSelectValue(actividadTipo)) invalidInputs.push("Tipo de actividad");
  if (!validateDescripcion(descripcion)) invalidInputs.push("Nombre de la actividad");
  if (!validateSchedule(myForm)) {
    invalidInputs.push(
      "Horario (un día elegido, hora de inicio y duración HH:MM entre 00:01 y 24:00)"
    );
  }
  if (!validateMediaFiles(files)) invalidInputs.push("Archivos (1 a 5 imágenes o videos)");
  if (!validateHttpUrl(enlace)) invalidInputs.push("Enlace (URL http o https válida)");

  if (invalidInputs.length > 0) {
    showClientErrors(invalidInputs);
    return false;
  }
  return true;
};

document.getElementById("submit-btn").addEventListener("click", () => {
  const myForm = document.forms["combinedForm"];
  if (!validateCombinedForm()) return;
  myForm.submit();
});
