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
    return data.datos || data || [];
  } catch (error) {
    console.error("Error fetching Datos de Miembros por Fecha de Registro", error);
    return [];
  }
}

cargarMiembrosPorDia().then(datos => {
  const seriesData = datos.map(d => ({
    x: Date.parse(d.fecha),
    y: Number(d.cantidad ?? d.valor ?? 0)
  }));

  Highcharts.chart('line_container', {
    chart: { type: 'line' },
    title: { text: 'Miembros Registrados por Día' },
    xAxis: { type: 'datetime' },
    yAxis: { title: { text: 'Número de registros' } },
    tooltip: {
      xDateFormat: '%Y-%m-%d',
      pointFormat: '{point.y} registros'
    },
    series: [{ name: 'Registros', data: seriesData }]
  });
  console.log(datos)
});


/* Gráfico Actividades por Tipo*/

async function cargarActividadesPorTipo() {
  try {
    const response = await fetch("/api/estadisticas/actividades-por-tipo");
    if (!response.ok) throw new Error(response.statusText);
    const data = await response.json();
    return data.datos || data || [];
  } catch (error) {
    console.error("Error fetching Datos de Actividades por Tipo", error);
    return [];
  }
}
cargarActividadesPorTipo().then(datos => {
  const seriesData = (datos || []).map(d => ({
    name: d.tipo || d.nombre || d.etiqueta || 'Sin nombre',
    y: Number(d.cantidad ?? d.valor ?? 0),
    color: d.color
  }));
  Highcharts.chart('pie_container', {
    chart: { type: 'pie' },
    title: { text: 'Cantidad de Actividades de cada Tipo' },
    tooltip: { pointFormat: '{point.y} ({point.percentage:.1f}%)' },
    subtitle: { text: 'Source: Me inventé los datos' },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: [{
          enabled: true,
          distance: 20
        }, {
          enabled: true,
          distance: -40,
          format: '{point.percentage:.1f}%',
          style: {
            fontSize: '1.2em',
            textOutline: 'none',
            opacity: 0.7
          },
          filter: {
            operator: '>',
            property: 'percentage',
            value: 10
          }
        }]
      }
    },
    series: [{
      name: 'Cantidad',
      colorByPoint: true,
      data: seriesData
    }]
  });
  console.log(datos);
});

/* Gráfico Actividades por Comuna*/

async function cargarActividadesPorComuna() {
  try {
    const response = await fetch("/api/estadisticas/actividades-por-comuna");
    if (!response.ok) throw new Error(response.statusText);
    const data = await response.json();
    return data.datos || data || [];
  } catch (error) {
    console.error("Error fetching Datos de Actividades por Comuna", error);
    return [];
  }
}

cargarActividadesPorComuna().then(datos => {
  const regionPalette = [
    '#2e7d32', '#1565c0', '#6a1b9a', '#c62828', '#ef6c00', '#00838f',
    '#5d4037', '#455a64', '#6d4c41', '#283593', '#ad1457', '#00897b',
    '#7b1fa2', '#d32f2f', '#f9a825', '#1e88e5'
  ];

  const categories = (datos || []).map((d) => d.comuna || 'Sin comuna');
  const regions = [...new Set((datos || []).map((d) => d.region || 'Sin región'))];
  const regionColorMap = regions.reduce((map, region, index) => {
    map[region] = regionPalette[index % regionPalette.length];
    return map;
  }, {});

  const regionSeriesMap = new Map();
  (datos || []).forEach((d, index) => {
    const region = d.region || 'Sin región';
    const point = {
      x: index,
      y: Number(d.cantidad ?? d.valor ?? 0),
      name: d.comuna || 'Sin comuna',
      color: regionColorMap[region],
    };
    if (!regionSeriesMap.has(region)) {
      regionSeriesMap.set(region, []);
    }
    regionSeriesMap.get(region).push(point);
  });

  const series = Array.from(regionSeriesMap.entries()).map(([region, data]) => ({
    name: region,
    color: regionColorMap[region],
    data,
    showInLegend: true,
  }));

  Highcharts.chart('bar_container', {
    chart: {
      type: 'column',
      zoomType: 'x',
      scrollablePlotArea: {
        minWidth: Math.max(categories.length * 12, 800),
        scrollPositionX: 0,
      },
    },
    title: { text: 'Número de Actividades Registradas por Comuna' },
    subtitle: { text: 'Cada barra representa una comuna y el color indica su región' },
    xAxis: {
      categories,
      title: { text: 'Comuna' },
      labels: {
        rotation: -90,
        align: 'right',
        style: { fontSize: '9px' },
        step: Math.ceil(categories.length / 40),
      },
    },
    yAxis: {
      min: 0,
      title: { text: 'Cantidad de actividades' },
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><br/>',
      pointFormat:
        '<span style="color:{point.color}">●</span> {series.name}: <b>{point.y}</b><br/>',
    },
    plotOptions: {
      column: {
        borderWidth: 0,
        pointPadding: 0.1,
        groupPadding: 0,
      },
      series: {
        borderWidth: 0,
      },
    },
    legend: {
      align: 'center',
      verticalAlign: 'bottom',
      layout: 'horizontal',
      itemStyle: { fontSize: '10px' },
    },
    credits: { enabled: false },
    series,
  });

  console.log(datos);
});

/* Fin Adiciones Tarea 3L*/

document.addEventListener("DOMContentLoaded", init);
