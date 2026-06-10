/**
 * Gráficos con Canvas 2D (sin librerías externas).
 * Los datos provienen de la base tarea2 (inyectados como JSON en graph_stats.html).
 */

function readStatsFromPage() {
  const el = document.getElementById("chart-stats-data");
  if (!el || !el.textContent.trim()) {
    return { miembros: [], actividades: [] };
  }
  try {
    return JSON.parse(el.textContent);
  } catch {
    return { miembros: [], actividades: [] };
  }
}

function drawBarChartVertical(canvas, data) {
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;
  const pad = { top: 24, right: 24, bottom: 48, left: 48 };
  const chartW = w - pad.left - pad.right;
  const chartH = h - pad.top - pad.bottom;

  ctx.fillStyle = "#fafafa";
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = "#ccc";
  ctx.beginPath();
  ctx.moveTo(pad.left, pad.top);
  ctx.lineTo(pad.left, h - pad.bottom);
  ctx.lineTo(w - pad.right, h - pad.bottom);
  ctx.stroke();

  if (!data || data.length === 0) {
    ctx.fillStyle = "#666";
    ctx.font = "14px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Sin datos en la base para este gráfico", w / 2, h / 2);
    return;
  }

  const max = Math.max(...data.map((d) => d.valor), 1);
  const barW = (chartW / data.length) * 0.6;
  const gap = (chartW / data.length) * 0.4;

  ctx.fillStyle = "#333";
  ctx.font = "12px Arial, sans-serif";
  ctx.textAlign = "center";
  data.forEach((d, i) => {
    const x0 = pad.left + i * (barW + gap) + gap / 2;
    const bh = (d.valor / max) * chartH;
    const y0 = h - pad.bottom - bh;
    ctx.fillStyle = d.color || "#1565c0";
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

  ctx.fillStyle = "#fafafa";
  ctx.fillRect(0, 0, w, h);

  if (!data || data.length === 0) {
    ctx.fillStyle = "#666";
    ctx.font = "14px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Sin datos en la base para este gráfico", w / 2, h / 2);
    return;
  }

  const max = Math.max(...data.map((d) => d.valor), 1);
  const rowH = chartH / data.length;
  const barH = rowH * 0.55;

  ctx.fillStyle = "#333";
  ctx.font = "12px Arial, sans-serif";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";

  data.forEach((d, i) => {
    const y = pad.top + i * rowH + rowH / 2;
    const bw = (d.valor / max) * chartW;
    ctx.fillStyle = "#444";
    ctx.fillText(d.etiqueta, pad.left - 8, y);
    ctx.fillStyle = d.color || "#1565c0";
    ctx.fillRect(pad.left, y - barH / 2, bw, barH);
    ctx.fillStyle = "#333";
    ctx.textAlign = "left";
    ctx.fillText(String(d.valor), pad.left + bw + 6, y);
    ctx.textAlign = "right";
  });
}

function fillLegend(ulId, data) {
  const ul = document.getElementById(ulId);
  if (!ul) return;
  ul.textContent = "";
  if (!data || data.length === 0) {
    const li = document.createElement("li");
    li.textContent = "Sin datos";
    ul.appendChild(li);
    return;
  }
  data.forEach((d) => {
    const li = document.createElement("li");
    const sw = document.createElement("span");
    sw.className = "chart-swatch";
    sw.style.backgroundColor = d.color || "#999";
    li.appendChild(sw);
    li.appendChild(document.createTextNode(`${d.etiqueta}: ${d.valor}`));
    ul.appendChild(li);
  });
}

function init() {
  const stats = readStatsFromPage();
  const c1 = document.getElementById("chart-miembros");
  const c2 = document.getElementById("chart-actividades");
  const m = stats.miembros || [];
  const a = stats.actividades || [];
  if (c1) {
    drawBarChartVertical(c1, m);
    fillLegend("legend-miembros", m);
  }
  if (c2) {
    drawBarChartHorizontal(c2, a);
    fillLegend("legend-actividades", a);
  }
}


/* Inicio Adiciones Tarea 3: */

/* Gráfico Miembros Registrados por Día */

async function cargarMiembrosPorDia() {
  try {
    const response = await fetch("/api/estadisticas/miembros-por-dia");
    if (!response.ok) throw new Error(response.statusText);
    const data = await response.json();
    return data.datos; // [{fecha: "...", cantidad: 5}, ...]
  } catch (error) {
    console.error("Error fetching Miembros Registrados por Día", error);
    return [];
  }
}

cargarMiembrosPorDia().then(datos => {
  // construir gráfico aquí
  console.log(datos);
});


/* Gráfico Actividades por Tipo*/

/* Gráfico Actividades por Comuna*/


/* Fin Adiciones Tarea 3L*/

document.addEventListener("DOMContentLoaded", init);
