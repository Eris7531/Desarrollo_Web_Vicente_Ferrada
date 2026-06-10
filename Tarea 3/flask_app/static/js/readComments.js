// Aquí se implementará la función asíncrona para obtener los comentarios de las bases de datos.


function getCommentsForActividad(actividadId) {
    async function getCommentsForActividad(actividadId) {
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
}