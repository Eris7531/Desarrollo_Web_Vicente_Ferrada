// Aquí se implementará la función asíncrona para obtener los comentarios de las bases de datos.

const COMMENT_BATCH_SIZE = 5;
const commentState = {};

async function fetchCommentsForActividad(actividadId) {
  try {
    const response = await fetch(`/api/comentarios/${actividadId}`);
    if (!response.ok) throw new Error(response.statusText);
    const data = await response.json();
    return data.comentarios || [];
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
}

function formatCommentDate(dateString) {
  if (!dateString) return "Fecha desconocida";
  const date = new Date(dateString);
  return date.toLocaleString("es-CL", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function createCommentCard(comment) {

  const card = document.createElement("article");
  card.className = "comment-card";

  const meta = document.createElement("div");
  meta.className = "comment-meta";
  meta.innerHTML = `
    <span class="comment-author">${comment.nombre}</span>
    <span class="comment-date">${formatCommentDate(comment.fecha)}</span>
  `;
  card.appendChild(meta);

  const texto = document.createElement("textarea");
  texto.className = "comment-text";
  texto.setAttribute("readonly", "true");
  texto.setAttribute("rows", "4");
  texto.setAttribute("cols", "50");
  texto.textContent = comment.texto;
  card.appendChild(texto);

  return card;
}

function ensureCommentState(actividadId) {
  if (!commentState[actividadId]) {
    commentState[actividadId] = {
      comments: [],
      order: "desc",
      visibleCount: COMMENT_BATCH_SIZE,
      loaded: false,
    };
  }
  return commentState[actividadId];
}

function updateCommentsCount(actividadId) {
  const state = commentState[actividadId];
  const countEl = document.getElementById(`comments-count-${actividadId}`);
  if (countEl) {
    countEl.textContent = `${state.comments.length} comentario${state.comments.length !== 1 ? "s" : ""}`;
  }
}

function updateLoadMoreButton(actividadId) {
  const state = commentState[actividadId];
  const btn = document.querySelector(`.load-more-comments-btn[data-actividad="${actividadId}"]`);
  if (!btn) return;
  btn.disabled = state.visibleCount >= state.comments.length;
  btn.textContent = state.visibleCount >= state.comments.length
    ? "No hay más comentarios"
    : "Cargar 5 comentarios más";
}

function renderCommentList(actividadId) {
  const state = commentState[actividadId];
  const list = document.getElementById(`comments-list-${actividadId}`);
  if (!list) return;

  list.innerHTML = "";

  if (!state.comments || state.comments.length === 0) {
    list.innerHTML = '<p class="no-comments">No hay comentarios, sé el primer comentario.</p>';
    updateCommentsCount(actividadId);
    updateLoadMoreButton(actividadId);
    return;
  }

  const sorted = [...state.comments].sort((a, b) => {
    if (state.order === "asc") {
      return new Date(a.fecha) - new Date(b.fecha);
    }
    return new Date(b.fecha) - new Date(a.fecha);
  });

  const visibleComments = sorted.slice(0, state.visibleCount);
  visibleComments.forEach((comment) => {
    list.appendChild(createCommentCard(comment));
  });

  updateCommentsCount(actividadId);
  updateLoadMoreButton(actividadId);
}

async function loadCommentsForActividad(actividadId) {
  const state = ensureCommentState(actividadId);
  state.comments = await fetchCommentsForActividad(actividadId);
  state.visibleCount = COMMENT_BATCH_SIZE;
  renderCommentList(actividadId);
  state.loaded = true;
}

function hideComments(actividadId) {
  const list = document.getElementById(`comments-list-${actividadId}`);
  if (list) list.innerHTML = "";
  const btn = document.querySelector(`.load-more-comments-btn[data-actividad="${actividadId}"]`);
  if (btn) btn.disabled = true;
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".comments-order-select").forEach((select) => {
    const actividadId = select.dataset.actividad;
    if (!actividadId) return;
    select.addEventListener("change", () => {
      const state = ensureCommentState(actividadId);
      state.order = select.value;
      renderCommentList(actividadId);
    });
  });

  document.querySelectorAll(".load-more-comments-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const actividadId = button.dataset.actividad;
      const state = ensureCommentState(actividadId);
      state.visibleCount += COMMENT_BATCH_SIZE;
      renderCommentList(actividadId);
    });
  });

  document.querySelectorAll(".hide-comments-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const actividadId = button.dataset.actividad;
      hideComments(actividadId);
    });
  });

  document.querySelectorAll(".comments-list").forEach((list) => {
    const actividadId = list.dataset.actividad;
    if (actividadId) loadCommentsForActividad(actividadId);
  });
});

window.loadCommentsForActividad = loadCommentsForActividad;