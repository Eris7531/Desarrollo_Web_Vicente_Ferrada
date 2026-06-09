/*
Aquí se crearán las validaciones para el formulario de comentarios.
*/

const validateComment = (comment) => {
  /* 
  <Arreglar esta validación, ya quese debe adaptar a un cuadro de texto de un máximo de 4 líneas y 50 columnas, 
  por lo que se debe validar que el comentario tenga al menos 1 caracter y a lo más 200 caracteres, considerando 
  los saltos de línea como caracteres.>
  */
  
  if (!comment || typeof comment !== "text box") return false;
  const trimmed = comment.trim();
  return trimmed.length >= 1 && trimmed.length <= 500;

};


/*
Esta validación debería estar correcta, pero revisar la sección que dice 'typeof name !== "string"'.
*/

const validateCommentPosterName = () => {
    if (!name || typeof name !== "string") return false;    
    const trimmed = name.trim();
    return trimmed.length >= 3 && trimmed.length <= 80;
};
