/*
Aquí se crearán las validaciones para el formulario de comentarios.
*/

const validateComment = (comment) => {
  /* 
  <Arreglar esta validación, ya quese debe adaptar a un cuadro de texto de un máximo de 4 líneas y 50 columnas, 
  por lo que se debe validar que el comentario tenga al menos 1 caracter y a lo más 200 caracteres, considerando 
  los saltos de línea como caracteres.>
  */
  
  if (!comment || typeof comment !== "string") 
    return false;
  const trimmed = comment.trim();
  return trimmed.length >= 5 && trimmed.length <= 300;
};
/*
Esta validación debería estar correcta, pero revisar la sección que dice 'typeof name !== "string"'.
*/

const validateCommentPosterName = (name) => {
    if (!name || typeof name !== "string") 
      return false;    
    const trimmed = name.trim();
    return trimmed.length >= 3 && trimmed.length <= 80;
};

async function handleCommentFormSubmit(event) {
  event.preventDefault();
  
  const form = event.target;
  const nombre = form.querySelector('input[name="nombre"]').value;
  const texto = form.querySelector('textarea[name="comentario"]').value;
  const actividad_id = form.querySelector('input[name="actividad_id"]').value;
  
  // Validar
  if (!validateCommentPosterName(nombre)) {
    alert("Nombre debe tener entre 3 y 80 caracteres.");
    return;
  }
  if (!validateComment(texto)) {
    alert("Comentario debe tener entre 5 caracteres.");
    return;
  }
  
  // Enviar con fetch
  try {
    const response = await fetch('/api/comentarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: nombre,
        texto: texto,
        actividad_id: parseInt(actividad_id)
      })
    });
    
    const data = await response.json();
    if (!response.ok) {
      alert("Error: " + (data.error || "No se pudo guardar"));
      return;
    }
    
    alert("Comentario agregado!");
    if (window.loadCommentsForActividad) {
      window.loadCommentsForActividad(parseInt(actividad_id, 10));
    };
    form.reset();
    // Aquí recargarías la lista de comentarios
  } catch (error) {
    alert("Error de conexión: " + error);
  }
}