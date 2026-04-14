/**
 * Datos de ejemplo (prototipo sin backend).
 * @type {Array<{nombre: string, email: string, telefono: string, tipo: string, actividades: string}>}
 */
const MIEMBROS_EJEMPLO = [
  { nombre: "Ana Pérez", email: "ana.perez@ing.uchile.cl", telefono: "912345678", tipo: "Académico (Estudiante)", actividades: "Fútbol amateur, orquesta estudiantil" },
  { nombre: "Bruno Soto", email: "bruno.soto@ing.uchile.cl", telefono: "923456789", tipo: "Funcionario", actividades: "Senderismo, fotografía" },
  { nombre: "Carla Muñoz", email: "carla.munoz@ing.uchile.cl", telefono: "934567890", tipo: "Académico (Estudiante)", actividades: "Hackathon social, ajedrez" },
  { nombre: "Diego Rojas", email: "diego.rojas@ing.uchile.cl", telefono: "987654321", tipo: "Funcionario", actividades: "Ciclismo, voluntariado" },
  { nombre: "Elena Fuentes", email: "elena.fuentes@ing.uchile.cl", telefono: "911223344", tipo: "Académico (Estudiante)", actividades: "Teatro, coro" },
  { nombre: "Felipe Núñez", email: "felipe.nunez@ing.uchile.cl", telefono: "923344556", tipo: "Funcionario", actividades: "Running, lectura" },
  { nombre: "Gabriela López", email: "gabriela.lopez@ing.uchile.cl", telefono: "955667788", tipo: "Académico (Estudiante)", actividades: "Danza, debate" },
  { nombre: "Héctor Vera", email: "hector.vera@ing.uchile.cl", telefono: "923778899", tipo: "Funcionario", actividades: "Escalada, cocina" },
  { nombre: "Isidora Campos", email: "isidora.campos@ing.uchile.cl", telefono: "922334455", tipo: "Académico (Estudiante)", actividades: "Pintura, yoga" },
  { nombre: "Javier Ortiz", email: "javier.ortiz@ing.uchile.cl", telefono: "988776655", tipo: "Funcionario", actividades: "Natación, podcast" },
  { nombre: "Karina Díaz", email: "karina.diaz@ing.uchile.cl", telefono: "933445566", tipo: "Académico (Estudiante)", actividades: "Robótica recreativa, música" },
  { nombre: "Leonardo Reyes", email: "leonardo.reyes@ing.uchile.cl", telefono: "924455667", tipo: "Funcionario", actividades: "Tenis de mesa, jardinería" }
];

let currentPage = 1;

function getFiltered() {
  const tipo = document.getElementById("filter-tipo").value;
  if (!tipo) return [...MIEMBROS_EJEMPLO];
  return MIEMBROS_EJEMPLO.filter((m) => m.tipo === tipo);
}

function compare(sortKey, a, b) {
  const [field, dir] = sortKey.split("-");
  const mult = dir === "asc" ? 1 : -1;
  let va;
  let vb;
  if (field === "nombre") {
    va = a.nombre.toLocaleLowerCase();
    vb = b.nombre.toLocaleLowerCase();
    return va < vb ? -mult : va > vb ? mult : 0;
  }
  if (field === "email") {
    va = a.email.toLocaleLowerCase();
    vb = b.email.toLocaleLowerCase();
    return va < vb ? -mult : va > vb ? mult : 0;
  }
  if (field === "telefono") {
    va = a.telefono;
    vb = b.telefono;
    return va < vb ? -mult : va > vb ? mult : 0;
  }
  return 0;
}

function getSorted(list) {
  const sortKey = document.getElementById("sort-by").value;
  return [...list].sort((a, b) => compare(sortKey, a, b));
}

function getPageSlice(sorted) {
  const size = parseInt(document.getElementById("page-size").value, 10);
  const total = sorted.length;
  const totalPages = total === 0 ? 0 : Math.ceil(total / size);
  if (totalPages > 0 && currentPage > totalPages) currentPage = totalPages;
  if (totalPages === 0) currentPage = 1;
  const start = totalPages === 0 ? 0 : (currentPage - 1) * size;
  return { rows: sorted.slice(start, start + size), totalPages, size, total };
}

function render() {
  const filtered = getFiltered();
  const sorted = getSorted(filtered);
  const { rows, totalPages, size, total } = getPageSlice(sorted);
  const tbody = document.getElementById("members-tbody");
  tbody.textContent = "";
  for (const m of rows) {
    const tr = document.createElement("tr");
    [m.nombre, m.email, m.telefono, m.tipo, m.actividades].forEach((cell) => {
      const td = document.createElement("td");
      td.textContent = cell;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  }
  const info = document.getElementById("page-info");
  if (total === 0) {
    info.textContent = "No hay registros para el filtro seleccionado.";
  } else {
    const startIdx = (currentPage - 1) * size + 1;
    const endIdx = Math.min(currentPage * size, total);
    info.textContent = `Página ${currentPage} de ${totalPages} · Mostrando ${startIdx}–${endIdx} de ${total} registros`;
  }
  document.getElementById("btn-prev").disabled = total === 0 || currentPage <= 1;
  document.getElementById("btn-next").disabled = total === 0 || currentPage >= totalPages;
}

function init() {
  document.getElementById("filter-tipo").addEventListener("change", () => {
    currentPage = 1;
    render();
  });
  document.getElementById("sort-by").addEventListener("change", () => {
    currentPage = 1;
    render();
  });
  document.getElementById("page-size").addEventListener("change", () => {
    currentPage = 1;
    render();
  });
  document.getElementById("btn-prev").addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage -= 1;
      render();
    }
  });
  document.getElementById("btn-next").addEventListener("click", () => {
    const filtered = getFiltered();
    const sorted = getSorted(filtered);
    const size = parseInt(document.getElementById("page-size").value, 10);
    const total = sorted.length;
    const totalPages = total === 0 ? 0 : Math.ceil(total / size);
    if (totalPages > 0 && currentPage < totalPages) {
      currentPage += 1;
      render();
    }
  });
  render();
}

document.addEventListener("DOMContentLoaded", init);
