const MIN_CHARS = 3;
const EVAL_SCORES = [1, 2, 3, 4, 5, 6, 7];

const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const resultsBody = document.getElementById("search-results-body");
const statusEl = document.getElementById("search-status");

let debounceTimer = null;
let currentQuery = "";

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeRegExp(text) {
  return String(text).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightMatch(text, query) {
  if (!text || !query) {
    return escapeHtml(text || "");
  }
  const safe = escapeHtml(text);
  const pattern = new RegExp(`(${escapeRegExp(query)})`, "gi");
  return safe.replace(pattern, '<mark class="search-hit">$1</mark>');
}

function formatNota(promedio) {
  if (promedio == null) {
    return "-";
  }
  return Number.isInteger(promedio) ? String(promedio) : promedio.toFixed(1);
}

function buildScoreOptions(selected) {
  return EVAL_SCORES.map((score) => {
    const selectedAttr = score === selected ? " selected" : "";
    return `<option value="${score}"${selectedAttr}>${score}</option>`;
  }).join("");
}

function renderEmpty(message, colspan = 7) {
  resultsBody.innerHTML = `
    <tr>
      <td colspan="${colspan}">${escapeHtml(message)}</td>
    </tr>
  `;
}

function renderRows(rows, query) {
  if (!rows || rows.length === 0) {
    renderEmpty(`No se encontraron actividades para «${query}».`);
    return;
  }

  resultsBody.innerHTML = rows
    .map((item) => {
      const actividadId = item.actividad_id;
      return `
        <tr data-actividad-id="${escapeHtml(actividadId)}">
          <td>${escapeHtml(item.nombreMiembro)}</td>
          <td>${escapeHtml(item.diaActividad)}</td>
          <td>${highlightMatch(item.tipoActividad, query)}</td>
          <td>${highlightMatch(item.comuna, query)}</td>
          <td>${highlightMatch(item.nombreActividad, query)}</td>
          <td>
            <span class="nota-display" data-actividad-id="${escapeHtml(actividadId)}">
              ${escapeHtml(formatNota(item.nota_promedio))}
            </span>
          </td>
          <td class="evaluate-cell">
            <button type="button" class="nav-btn nav-btn--small btn-evaluar" data-actividad-id="${escapeHtml(actividadId)}">
              Evaluar
            </button>
            <div class="evaluate-panel hidden" data-actividad-id="${escapeHtml(actividadId)}">
              <select class="score-select" aria-label="Seleccionar nota">
                ${buildScoreOptions(4)}
              </select>
              <button type="button" class="nav-btn nav-btn--small btn-confirm-nota">Confirmar</button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");

  bindEvaluateHandlers();
}

function bindEvaluateHandlers() {
  document.querySelectorAll(".btn-evaluar").forEach((button) => {
    button.addEventListener("click", () => {
      const actividadId = button.getAttribute("data-actividad-id");
      const panel = document.querySelector(`.evaluate-panel[data-actividad-id="${actividadId}"]`);
      if (panel) {
        panel.classList.remove("hidden");
        button.classList.add("hidden");
      }
    });
  });

  document.querySelectorAll(".btn-confirm-nota").forEach((button) => {
    button.addEventListener("click", async () => {
      const panel = button.closest(".evaluate-panel");
      const actividadId = panel.getAttribute("data-actividad-id");
      const select = panel.querySelector(".score-select");
      const notaValor = Number(select.value);
      await submitNota(actividadId, notaValor, panel);
    });
  });
}

async function fetchSearchResults(query) {
  const response = await fetch(`/api/actividades/buscar?${new URLSearchParams({ q: query })}`);
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error || "Error en la búsqueda");
  }

  return payload.actividades || [];
}

async function submitNota(actividadId, notaValor, panel) {
  if (!EVAL_SCORES.includes(notaValor)) {
    alert("La nota debe ser un entero entre 1 y 7.");
    return;
  }

  const response = await fetch("/api/notas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ actividad_id: Number(actividadId), nota: notaValor }),
  });

  const data = await response.json();
  if (!response.ok) {
    alert(data.error || "No se pudo guardar la nota.");
    return;
  }

  const notaSpan = document.querySelector(`.nota-display[data-actividad-id="${actividadId}"]`);
  if (notaSpan) {
    notaSpan.textContent = formatNota(data.nota_promedio);
  }

  panel.classList.add("hidden");
  const evalButton = document.querySelector(`.btn-evaluar[data-actividad-id="${actividadId}"]`);
  if (evalButton) {
    evalButton.classList.remove("hidden");
  }
}

async function runSearch(query) {
  const trimmed = (query || "").trim();
  currentQuery = trimmed;

  if (trimmed.length < MIN_CHARS) {
    statusEl.textContent = "";
    renderEmpty("Ingresa al menos 3 caracteres para buscar.");
    return;
  }

  statusEl.textContent = "Buscando…";

  try {
    const rows = await fetchSearchResults(trimmed);
    statusEl.textContent = rows.length
      ? `Se encontraron ${rows.length} actividad(es).`
      : "";
    renderRows(rows, trimmed);
  } catch (error) {
    statusEl.textContent = "";
    renderEmpty(error.message || "No se pudo completar la búsqueda.");
  }
}

input.addEventListener("input", () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => runSearch(input.value), 300);
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  await runSearch(input.value);
});
