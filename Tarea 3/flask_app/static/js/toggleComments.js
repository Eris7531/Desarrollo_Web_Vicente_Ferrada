

document.addEventListener("DOMContentLoaded", () => {
  const toggleCommentsButtons = document.querySelectorAll(".toggle-comments-btn");
  const toggleAddCommentButtons = document.querySelectorAll(".toggle-add-comment-btn");

  toggleCommentsButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const actividadId = button.dataset.actividadId;
      const panel = document.getElementById(`comments-panel-${actividadId}`);
      if (!panel) return;
      panel.classList.toggle("hidden");
      button.textContent = panel.classList.contains("hidden")
        ? "Ver comentarios"
        : "Ocultar comentarios";
    });
  });

  toggleAddCommentButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const actividadId = button.dataset.actividadId;
      const formPanel = document.getElementById(`add-comment-panel-${actividadId}`);
      if (!formPanel) return;
      formPanel.classList.toggle("hidden");
      button.textContent = formPanel.classList.contains("hidden")
        ? "Agregar un comentario"
        : "Ocultar formulario";
    });
  });
});