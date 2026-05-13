/**
 * Filtro región → comunas (solo UI; la región no se envía al servidor)
 * y diálogo para elegir un único día de la semana.
 * Valores del hidden `dia`: lunes, martes, miercoles, …, sabado, domingo (ASCII = ENUM en BD).
 */
const DIA_ETIQUETAS = {
  lunes: "Lunes",
  martes: "Martes",
  miercoles: "Miércoles",
  jueves: "Jueves",
  viernes: "Viernes",
  sabado: "Sábado",
  domingo: "Domingo",
};

function filtrarComunasPorRegion() {
  const regionSel = document.getElementById("region-filtro");
  const comunaSel = document.getElementById("comuna_id");
  if (!regionSel || !comunaSel) return;
  const rid = regionSel.value;
  let visible = 0;
  comunaSel.querySelectorAll("option[data-region-id]").forEach((opt) => {
    const match = !rid || opt.getAttribute("data-region-id") === rid;
    opt.hidden = !match;
    if (!match && opt.selected) {
      opt.selected = false;
    }
    if (match) visible += 1;
  });
  const first = comunaSel.querySelector("option[value='']");
  if (first) first.hidden = false;
  if (visible === 0 && rid) {
    comunaSel.value = "";
  }
}

function actualizarEtiquetaDia() {
  const hidden = document.getElementById("dia-elegido");
  const span = document.getElementById("dia-etiqueta");
  if (!hidden || !span) return;
  const v = hidden.value.trim();
  span.textContent = v ? DIA_ETIQUETAS[v] || v : "Ningún día seleccionado";
}

function initDiaDialog() {
  const btn = document.getElementById("btn-elegir-dia");
  const dlg = document.getElementById("dia-dialog");
  const cancel = document.getElementById("dia-dialog-cancel");
  const confirm = document.getElementById("dia-dialog-confirm");
  const hidden = document.getElementById("dia-elegido");
  if (!btn || !dlg || !hidden) return;

  btn.addEventListener("click", () => {
    const actual = hidden.value;
    dlg.querySelectorAll('input[name="dia-temp"]').forEach((r) => {
      r.checked = r.value === actual;
    });
    if (typeof dlg.showModal === "function") dlg.showModal();
  });

  if (cancel) cancel.addEventListener("click", () => dlg.close());
  if (confirm) {
    confirm.addEventListener("click", () => {
      const sel = dlg.querySelector('input[name="dia-temp"]:checked');
      hidden.value = sel ? sel.value : "";
      actualizarEtiquetaDia();
      dlg.close();
    });
  }
}

function init() {
  const regionSel = document.getElementById("region-filtro");
  const comunaSel = document.getElementById("comuna_id");
  if (comunaSel && regionSel && comunaSel.value) {
    const opt = comunaSel.options[comunaSel.selectedIndex];
    const rid = opt && opt.getAttribute("data-region-id");
    if (rid) regionSel.value = rid;
  }
  if (regionSel) {
    regionSel.addEventListener("change", filtrarComunasPorRegion);
    filtrarComunasPorRegion();
  }
  initDiaDialog();
  actualizarEtiquetaDia();
}

document.addEventListener("DOMContentLoaded", init);
