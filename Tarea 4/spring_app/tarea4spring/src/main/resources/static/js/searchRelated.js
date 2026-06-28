const form = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const resultsBody = document.getElementById("search-results-body");
const searchStatus = document.getElementById("search-status");

const MIN_CHARS = 3;
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

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightText(text, query) {
  const safeText = escapeHtml(text || "");
  const term = (query || "").trim();
  if (!term || term.length < MIN_CHARS) {
    return safeText || "—";
  }

  const pattern = new RegExp(`(${escapeRegExp(term)})`, "gi");
  return (safeText || "—").replace(pattern, '<mark class="search-highlight">$1</mark>');
}

function buildNotaSelectOptions() {
  let options = "";
  for (let i = 1; i <= 7; i += 1) {
    options += `<option value="${i}">${i}</option>`;
  }
  return options;
}

function renderEvaluarCell(actividadId) {
  return `
    <div class="eval-cell" data-actividad-id="${actividadId}">
      <button type="button" class="eval-btn" data-action="show-eval">Evaluar</button>
      <form class="eval-form hidden" data-action="eval-form" aria-label="Seleccionar nota">
        <select name="nota" aria-label="Nota entre 1 y 7" required>
          ${buildNotaSelectOptions()}
        </select>
        <button type="submit">Guardar</button>
      </form>
      <p class="eval-error hidden" role="alert"></p>
    </div>
  `;
}

function renderRows(rows, query) {
  if (!rows || rows.length === 0) {
    const message = query.length >= MIN_CHARS
      ? "No se encontraron resultados para tu búsqueda."
      : "Ingresa al menos 3 caracteres para iniciar la búsqueda.";
    resultsBody.innerHTML = `
      <tr>
        <td colspan="8">${message}</td>
      </tr>
    `;
    return;
  }

  resultsBody.innerHTML = rows
    .map((item) => {
      const totalNotas = item.totalNotas ?? 0;
      const notaLabel = item.notaPromedio === "-" ? "-" : escapeHtml(item.notaPromedio);
      const countLabel = totalNotas > 0
        ? `<span class="nota-count">(${totalNotas} eval.)</span>`
        : "";

      return `
        <tr data-actividad-id="${escapeHtml(item.actividadId)}">
          <td>${highlightText(item.nombreActividad, query)}</td>
          <td>${highlightText(item.descripcion, query)}</td>
          <td>${escapeHtml(item.dia)}</td>
          <td>${escapeHtml(item.tipo)}</td>
          <td>${escapeHtml(item.nombreMiembro)}</td>
          <td>${highlightText(item.nombreComuna, query)}</td>
          <td class="nota-cell" data-nota-cell>
            <span data-nota-value>${notaLabel}</span>
            ${countLabel}
          </td>
          <td>${renderEvaluarCell(item.actividadId)}</td>
        </tr>
      `;
    })
    .join("");

  bindEvaluarHandlers();
}

async function fetchSearchResults(query) {
  const response = await fetch("/busqueda/resultados", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error("Error en la búsqueda");
  }

  const payload = await response.json();
  return payload.datos || [];
}

async function ejecutarBusqueda(query) {
  currentQuery = query;
  if (query.length < MIN_CHARS) {
    searchStatus.textContent = query.length > 0
      ? `Escribe ${MIN_CHARS - query.length} carácter(es) más para buscar.`
      : "";
    renderRows([], query);
    return;
  }

  searchStatus.textContent = "Buscando...";
  try {
    const rows = await fetchSearchResults(query);
    searchStatus.textContent = rows.length === 0
      ? "Sin resultados."
      : `${rows.length} resultado(s) encontrado(s).`;
    renderRows(rows, query);
  } catch (error) {
    console.error(error);
    searchStatus.textContent = "No se pudo completar la búsqueda.";
    resultsBody.innerHTML = `
      <tr>
        <td colspan="8">Ocurrió un error al buscar. Intente nuevamente.</td>
      </tr>
    `;
  }
}

function validarNotaEntera(valor) {
  const numero = Number(valor);
  return Number.isInteger(numero) && numero >= 1 && numero <= 7;
}

async function enviarNota(actividadId, nota, errorBox) {
  errorBox.classList.add("hidden");
  errorBox.textContent = "";

  if (!validarNotaEntera(nota)) {
    errorBox.textContent = "La nota debe ser un entero entre 1 y 7.";
    errorBox.classList.remove("hidden");
    return;
  }

  const response = await fetch(`/api/actividades/${actividadId}/notas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nota: Number(nota) }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    errorBox.textContent = payload.error || "No se pudo guardar la nota.";
    errorBox.classList.remove("hidden");
    return;
  }

  const fila = document.querySelector(`tr[data-actividad-id="${actividadId}"]`);
  if (!fila) {
    return;
  }

  const notaCell = fila.querySelector("[data-nota-cell]");
  if (notaCell) {
    const valor = payload.notaPromedio ?? "-";
    const total = payload.totalNotas ?? 0;
    const countHtml = total > 0
      ? `<span class="nota-count">(${total} eval.)</span>`
      : "";
    notaCell.innerHTML = `<span data-nota-value>${escapeHtml(valor)}</span>${countHtml}`;
  }

  const evalCell = fila.querySelector(".eval-cell");
  if (evalCell) {
    const formEval = evalCell.querySelector('[data-action="eval-form"]');
    const btnEval = evalCell.querySelector('[data-action="show-eval"]');
    formEval.classList.add("hidden");
    btnEval.classList.remove("hidden");
    formEval.reset();
  }
}

function bindEvaluarHandlers() {
  resultsBody.querySelectorAll('[data-action="show-eval"]').forEach((button) => {
    button.addEventListener("click", () => {
      const cell = button.closest(".eval-cell");
      const formEval = cell.querySelector('[data-action="eval-form"]');
      button.classList.add("hidden");
      formEval.classList.remove("hidden");
      formEval.querySelector("select").focus();
    });
  });

  resultsBody.querySelectorAll('[data-action="eval-form"]').forEach((evalForm) => {
    evalForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const cell = evalForm.closest(".eval-cell");
      const actividadId = cell.getAttribute("data-actividad-id");
      const nota = evalForm.querySelector('select[name="nota"]').value;
      const errorBox = cell.querySelector(".eval-error");
      await enviarNota(actividadId, nota, errorBox);
    });
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
});

searchInput.addEventListener("input", () => {
  const query = (searchInput.value || "").trim();
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    ejecutarBusqueda(query);
  }, 300);
});

document.addEventListener("DOMContentLoaded", () => {
  renderRows([], "");
});
