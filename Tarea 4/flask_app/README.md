Tarea 2:

Deciciones de diseño:

1. Se unieron en el from de registrar miembros y de registrar actividad, pues se indica así en el enunciado.
2. Al unificar los forms, se debió implementar formas de que se pueda agregar actividades por un día individual, contrario a lo que se tenía antes en la tarea 1.
3. Ahora si se registra un miembro con los mismos datos a uno ya existete, no se agrega una vez más, si no que solo se agrega la actividad con el miembro\_id igual a uno ya existente.
4. Se pueden borrar actividades, y si un miembro queda sin actividades, este no es borrado de la base de datos, reflejando una red solcial o aplicacion en donde se tiene usuarios, los cuales no tiene que estar obligados a tener material dentro del servidor para mantener su estado de usuario / poseción de cuenta.


NOTA IMPORTANTE: Al crear el segundo branch, el de Tarea2, tuve problemas, y se me borraron la mayoría de los archivos y no logré recuperar todos al momento de la entrega, por lo que hubieron errores que había solucionado antes ahora no funcionan al 100%:

1. Error al registrar actividades en miércoles / sábado por desajuste tildes entre sabado y miercoles. -> solucionado con modificación a tarea2.sql o al aplicar el archivo 'ajuste.sql'. 

---------------------------------------------------------------------------------------------------------------------------------------------

Tarea 3:

Deciciones de diseño:

**Sección planificación del Proyecto:**

1. En la tarea 2, cuando uno quiere ver los detalles de una actividad de parte de un alumno, puede acceder desde el 'Listado de Miembros' o desde la Vista de inicio, en donde se muestran los últimos 5 usuarios que agregaron actividades y qué actividades tienen, al hacer click sobre la línea que tiene el usuario con la actividad que uno desea revisar en detalle. Esto te dirige a una página similar a un perfil, en donde uno puede ver los detalles del miembro y *todas* las *actividades* registradas a su nombre. 

Esto se visualiza como bloques que contienen la información de la actividad. Al tener *múltiples* actividades dentro del perfil de un mismo usuario, agregar una caja de comentarios a cada actividad de un usuario agregaría demaciada información. Además, en caso de que una actividad tenga comentarios, la siguiente actividad dentro del perfil se vería deplazada más abajo, lo cual no es ideal visualmente.

08/06: Idea: Hacer que cada actividad dentro de un perfil tenga una sección de comentarios en su sección inferior, la cual debe poder expanderse al momento de hacer click sobre esta. De este modo, a menos que uno quiera interactuar con los comentarios de dicha actividad (sea leer los ya escritos o escribir uno nuevo), esta caja de comentarios no generará ruido visual innecesario. La tarea no pide poder agragar 'respuestas' a comentarios anteriores, así que no se considerará esa opción.
Se puede usar (https://www.w3schools.com/howto/howto_js_collapsible.asp).

2. Para la sección de gráficos se mantendrán los gráficos actuales de barras, los cuales ya estaban configurados para repsesentar y comparar:

 1) La cantidad de miembros de cada región.
 2) La cantidad de actividades registradas de cada tipo / categoría.

Tras eso se agregarán los graficos que se piden en el enunciado:

 1) Gráfico de lineas que indique: Cantidad de Miembros Registrados v/s Día, indicando la cantidad de registros por cada día.
 2) Gráfico de torta que indique: Total de actividades de cada tipo / categoría. (Se considera eliminar el de barras de la tarea anterior que cumple la misma función).
 3) Gráfico de barras que indique: Total de *actividades* v/s *Comúna*. 
    08/06: Idea: Asignar un color a cada región y agregar una leyenda de esta asignación, de modo de que se pueda identificar a qué región corresponde cada comuna.

3. Para hacer los gráficos se decidió usar Highcharts 

 1) Información Flot: 
    1) Documentación e Introducción: (https://github.com/flot/flot/blob/master/API.md) 
    2) Pie Chart Example: (https://www.flotcharts.org/flot/examples/series-pie/index.html)

 2) Información Highcharts:
    1) Pie Chart with Code: (https://www.highcharts.com/docs/chart-and-series-types/pie-chart)
    2) Bar Chart with Code: (https://www.highcharts.com/docs/chart-and-series-types/bar-chart)
    3) Line Chart with Code: (https://www.highcharts.com/docs/chart-and-series-types/line-chart)

**Sección desarrollo del Proyecto:**

*-- Sección Comentarios --*

1. *08/06:* Inicialmente se plenó crear dos nuevos templates para los comentarios, uno para el formulario que dejará al usuario agregar un comentario y otro para la visualización de los comentarios previamente agregados a una dada actividad. Estos serían *incluidos* dentro de el template previamente creado *'member_detail'* ya que ahí es donde se encontrarán los comentarios. En caso de ser complicado el paso de información desde un template a otro, simplemente se agregarán los contenidos de los templates, *'comment_form-html'* y *'read_comments-html'*, dento de *'member_detail.html'*, eliminando los previamente mencionados.

*09/06:* Se logró medianamente la implementación de *templates html* dentro de otro template, por lo que se va a mantener el uso de este método. Solo falta pulir detalles de esta estructura.

2. *10/06:* Se decidió establecer un límite de carga de 5 comentarios iniciales por actividad e implementar un botón que permita cargar los siguientes 5. Además poder ordenar los comentarios por fecha. Por simplicidad, no se considera la opción de interactuar con otros comentarios, ej: responder a comentarios previamente existenes, además de que no es requisito de la tarea. 

Para poder ordenar los comentarios se agregaron las funciones necesarias relacionadas dentro de el archivo js que maneja todo lo relacionado a la carga de comentarios, readComments.js.

3. *10/06:* Dentro de las validaciones de comentario, en la sección 'nombre del comentarista' en particular, no se va a pedir que sea un miembro, por lo que las validaciones solamente serán relacionadas al largo del texto ingresado; 3 =< len =< 80.

4. *10/06:* En la caja de comentarios, el usuario puede seleccionar el orden de ver los comentarios por fecha de publicación, con opción de ver desde los más antijuos o desde los más recientes.

Finalmente, se añadió un botón que colapsa todos los comantarios. Si se interactúa con el botón (mostrar 5 comentarios más) muchas veces, volver al inicio de la caja de comentarios es una lata, por lo que colapsar todos facilita esto.

Se consideró implementar una flecha que the lleve al inicio de la caja de comentarios, pero se optó por la opción anterior ya que es similar a lo implementado en la lista de miembros, con páginas de 5 máximo.

*-- Sección Gráficos --*

1. *10/06:* El proceso de obtener los datos desde la base de datos se adiere al proceso típico de definir la función que hace un query en el lado servidor con db.py, y luego un archivo javascript solicita los datos para crear los gráficos en el lado del usuario/browser utilizando métodos como fetch y XHR asíncronos.

2. *10/06:* Se utilizaron los ejemplos de gráficos de cada tipo de Highcharts para usar como base, tanto en el HTML, JS, y CSS.

3. *10/06:* En el tercer gráfico, el de barras que representa la cantidad de actividades registradas por comuna, se logró implementar colores por región. *Preocupación* de diseño: Si bien los datos introducidos a la base de datos no son muchos porque es una lata meterlos mediante el formuario, y por eso los gráficos actualmente representan cantidades bajas de datos, estos pueden verse afectados en su visibilidad al aumentar el volumen de estos. Esta preocupación va enfocada al *gráfico de barras* que en el eje X tiene que mostrar una barra por comuna. Esto es un problema considerando que hay un total de 345 datos en esta tabla. 

*Solución pensada:* Agregar una función *scroll* horizontal al gráfico y un *ancho mínimo* para las barras. De este modo, cuando se junte un número específico de barras dentro del gráfico, este pueda expandirse a los lados sin perjudicar la visibilidad. No se pueden definir estas muy anchas, pues no queremos un scroll horizontal eterno para poder acceder a ciertos datos. *Ver si se implementará esta optimización al final del trabajo si queda tiempo*.

*-- Sección Corrección y Validación de archivos HTML --*

1. *12/06:* Detalles finales: 

   1.1. CSS validado *sin errores*.

   1.2. *html en general:* Se detecta el uso de los carácteres '{' y '}' como erroneo, por lo que el validador no acepta expreciones *Jinja*.
   
   1.3. *read_comment.html y comment_form.html:* Se detecta como error la falta de sección *<head>*, lo cual se hizo considerando que estos templates son implementados dentro de otro template previamente definido, *member_details.html*, el cual si tiene esta sección, en donde se incluye *<DOCTYPE html>, <html lang="en">, y <meta charset="UTF-8">*. La falta de estos genera un error dentro del validador.

   Se mandó correo preguntando sobre la validéz de este error y se espera respuesta para ver cual de las tres soluciones se implementará: <Agregar los datos faltantes a estos dos archivos>, <ignorar el error> o <combinar los archivos de modo que las funciones de comentar (formulario para agregar comentario) y de cargar los comentarios anteriores esté todo dentro de un mismo archivo html *junto con member_details.html*> 

   1.4. Muchos de los archivos html tienen problemas en la validación por el uso de jinja. Se verificó el uso de syntaxis jinja2 dentro del código de los aux y estos generan los mismos errores al pasar los archivos por el validador.

   2. Usando el validador de html (https://validator.w3.org/), al trabajar con la página descrita por la vista 'member_detail.html' de alguno de los miembros registrados, se detectan múltiples errores de etiquetas '<div>' y '</div>' que no se encuentran cerradas. Esto al revisar el archivo no se logra encontrar el error, pues todas las etiquetas se encuentran cerradas con su contraparte correspondiente con la identación correcta.

   3. No solo eso, si no que se detectan 'ID's duplicados. Esto no es un error de el template en si, si no que se detecta el uso de un mismo template múltiples veces dentro de una misma página. Como se explicó anteriormente, en la vista 'member_detail' se puede ver el listado de actividades de un miembro. Una de las deciciones de diseño fue que se iba a agregar una sección de comentarios al pie de cada una de estas actividades. Y otra decición de diseño hecha fue que se iba a crear un template para el formulario de comentarios y otro para la visualización de los comentarios. Estos dos templates son llamados por 'member_detail' para cada una de las actividades, por lo que dentro de una vista pueden haber múltiples llamadas a estos templates.
   
   En el caso de que se testee el html con un usuario que tenga n actividades, se generan n llamadas a los templates 'comment_form' y 'read_comments'. Por esto se cree que se tienen los errores descritos en este y el punto anterior.

   Estas deciciones de diseño fueron tomadas considerando que el volumen de actividades ingresadas para esta api no sería alto y con el objetivo de no agregar un gran volumen de líneas directamente al template 'member_detail'. Además la función de comentario es una que se puede ampliar a más áreas, por lo que tenerla separada de los detalles de un miembro, tenerlo separado me hizo más sentido inicialmente.

*--