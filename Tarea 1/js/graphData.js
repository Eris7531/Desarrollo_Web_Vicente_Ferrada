/**
 * Gráficos con Canvas 2D (sin librerías externas).
 * Datos coherentes con el listado de ejemplo.
 */

const DATOS_MIEMBROS = [
  { etiqueta: "Académico (Estudiante)", valor: 7, color: "#2e7d32" },
  { etiqueta: "Funcionario", valor: 5, color: "#1565c0" }
];

const DATOS_ACTIVIDADES = [
  { etiqueta: "Artística", valor: 18, color: "#6a1b9a" },
  { etiqueta: "Deportiva", valor: 32, color: "#c62828" },
  { etiqueta: "Tecnológica", valor: 24, color: "#ef6c00" },
  { etiqueta: "Social", valor: 15, color: "#00838f" },
  { etiqueta: "Otra", valor: 9, color: "#5d4037" }
];

function drawBarChartVertical(canvas, data) {
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;
  const pad = { top: 24, right: 24, bottom: 48, left: 48 };
  const chartW = w - pad.left - pad.right;
  const chartH = h - pad.top - pad.bottom;
  const max = Math.max(...data.map((d) => d.valor), 1);
  const barW = chartW / data.length * 0.6;
  const gap = chartW / data.length * 0.4;

  ctx.fillStyle = "#fafafa";
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = "#ccc";
  ctx.beginPath();
  ctx.moveTo(pad.left, pad.top);
  ctx.lineTo(pad.left, h - pad.bottom);
  ctx.lineTo(w - pad.right, h - pad.bottom);
  ctx.stroke();

  ctx.fillStyle = "#333";
  ctx.font = "12px Arial, sans-serif";
  ctx.textAlign = "center";
  data.forEach((d, i) => {
    const x0 = pad.left + i * (barW + gap) + gap / 2;
    const bh = (d.valor / max) * chartH;
    const y0 = h - pad.bottom - bh;
    ctx.fillStyle = d.color;
    ctx.fillRect(x0, y0, barW, bh);
    ctx.fillStyle = "#333";
    ctx.fillText(String(d.valor), x0 + barW / 2, y0 - 6);
    const label = d.etiqueta.length > 14 ? d.etiqueta.slice(0, 12) + "…" : d.etiqueta;
    ctx.fillText(label, x0 + barW / 2, h - pad.bottom + 16);
  });
}

function drawBarChartHorizontal(canvas, data) {
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;
  const pad = { top: 24, right: 24, bottom: 24, left: 120 };
  const chartW = w - pad.left - pad.right;
  const chartH = h - pad.top - pad.bottom;
  const max = Math.max(...data.map((d) => d.valor), 1);
  const rowH = chartH / data.length;
  const barH = rowH * 0.55;

  ctx.fillStyle = "#fafafa";
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = "#333";
  ctx.font = "12px Arial, sans-serif";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";

  data.forEach((d, i) => {
    const y = pad.top + i * rowH + rowH / 2;
    const bw = (d.valor / max) * chartW;
    ctx.fillStyle = "#444";
    ctx.fillText(d.etiqueta, pad.left - 8, y);
    ctx.fillStyle = d.color;
    ctx.fillRect(pad.left, y - barH / 2, bw, barH);
    ctx.fillStyle = "#333";
    ctx.textAlign = "left";
    ctx.fillText(String(d.valor), pad.left + bw + 6, y);
    ctx.textAlign = "right";
  });
}

function fillLegend(ulId, data) {
  const ul = document.getElementById(ulId);
  ul.textContent = "";
  data.forEach((d) => {
    const li = document.createElement("li");
    const sw = document.createElement("span");
    sw.className = "chart-swatch";
    sw.style.backgroundColor = d.color;
    li.appendChild(sw);
    li.appendChild(document.createTextNode(`${d.etiqueta}: ${d.valor}`));
    ul.appendChild(li);
  });
}

function init() {
  const c1 = document.getElementById("chart-miembros");
  const c2 = document.getElementById("chart-actividades");
  if (c1) {
    drawBarChartVertical(c1, DATOS_MIEMBROS);
    fillLegend("legend-miembros", DATOS_MIEMBROS);
  }
  if (c2) {
    drawBarChartHorizontal(c2, DATOS_ACTIVIDADES);
    fillLegend("legend-actividades", DATOS_ACTIVIDADES);
  }
}

document.addEventListener("DOMContentLoaded", init);
