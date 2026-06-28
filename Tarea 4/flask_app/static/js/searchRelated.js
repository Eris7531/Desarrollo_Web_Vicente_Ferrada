const form = document.getElementById("search-form");
const resultsBody = document.getElementById("search-results-body");

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderRows(rows) {
  if (!rows || rows.length === 0) {
    resultsBody.innerHTML = `
      <tr>
        <td colspan="5">No se encontraron resultados.</td>
      </tr>
    `;
    return;
  }

  resultsBody.innerHTML = rows
    .map((item) => `
      <tr class="data-row-click" data-href="/miembros/${escapeHtml(item.miembro_id)}">
        <td>${escapeHtml(item.nombreActividad)}</td>
        <td>${escapeHtml(item.dia)}</td>
        <td>${escapeHtml(item.tipo)}</td>
        <td>${escapeHtml(item.nombreMiembro)}</td>
        <td>${escapeHtml(item.nombreComuna)}</td>
      </tr>
    `)
    .join("");

  document.querySelectorAll(".data-row-click").forEach((row) => {
    row.addEventListener("click", () => {
      const href = row.getAttribute("data-href");
      if (href) window.location.href = href;
    });
    row.style.cursor = "pointer";
  });
}

async function fetchSearchResults(query) {
  const response = await fetch("/busqueda/resultados", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    console.error("Error en la búsqueda:", response.statusText);
    return [];
  }

  const payload = await response.json();
  return payload.datos || [];
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const query = form.query.value || "";
  const rows = await fetchSearchResults(query);
  renderRows(rows);
});