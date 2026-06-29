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

-----------------------------------------------------------------------------------------------------------------------------------------------

Tarea 4:

Deciciones de Diseño:

**Sección Observaciónes, Planificación y Comprención de Requisitos: (27/06)**

1. Las nuevas funcionalidades deben ser incroporadas usando si o si el framework *Spring Boot* y manteniendo la asyncronidad de Javascript usando las llamadas *xhr y/p fetch*.

2. Funciónalidad Nueva N°1 - *Buscador de Actividades*: Debe umplir los siguientes requisitos:

   a) Debe ser un *formulario* con un *único* input, el cual corresponde a un input de tipo *texto*.
   b) Al introducir *3 o más* carácteres dentro del campo de texto se debe *realizar una búsqueda automáticamente*, la cual deberá un *listado de actividades* que hagan match con lo escrito en el input con su *nombre, descripción o comuna* correspondiente.
   c) En caso de no encontrar match con los carácteres agregados en el campo de texto, se deberá mostrar un *mensaje* apropiado.
   d) Hacer click en un botón de *'buscar'* o seleccionar la tecla *enter* (por decidir aún en función a la dificultad y el tiempo, donde el botón probablemente resulta en una implementación más simple), se deberá dirigir a una nueva vista llamada *vista_resultados.html*.

3. Funciónalidad Nueva N°2 - *Vista Resultados de Búsqueda*: Esta tiene las siguientes propiedades:

   a) Es una vista adicional dentro del archivo *vista_resultados.html* la cual mostrará una lista de las actividades que hagan match con el input de búsqueda ingresado. 
   b) Debe indicar los siguientes atributos para cada actividad: [nombreMiembro, díaActividad, tipoActividad, comuna, nombreActividad, descripciónActividad]
   c) En cada fila de actividades, se debe *destacar* la parte de texto de la actividad que hace match con el input de texto.
   d) Tras mostrar los resultados de búsqueda, se debe *agregar una nueva información*. Esta es *'Nota'*, la cual tiene un valor '-' si la actividad aún *no ha sido evaluada*. Además se debe agregar un botón o enlace *'Evaluar'* la cual permite al usuario dar un *puntaje entre 1 y 7 (incluyendo los valores 1 y 7)* a dicha actividad. Este nuevo dato debe ser *agregado a la base de datos*, con las validaciones correspondientes.

**Sección Desiciones de Diseño:**

1. *(27/06)* El listado de resultados de búsqueda tendrá la misma estructura que la vista *'member_list.html'* ya que ambos presentan una lista de actividades con atributos relacionados. Basta con modificar qué atributos son los mostrados, la creación del botón para *'Evaluar'* y la función de *destacar* qué parte hizo match con la búsqueda. Se eliminará los filtros de orden alfabético y relacionados para reducir la compljidad de la vista. 

En caso de tener más tiempo, se haría un template *'listView_base.html'* para crear estas dos vistas y cualquier futura vista que involucre el mostrar una lista de datos obtenidos desde la base de datos.

2. *(27/06)* En las tareas anteriores, el atributo *descripción_actividad* no fue implementado correctamente. Este toma el atributo *nombre_actividad* como placeholder y no se solucionó en las tareas anteriores. Esto no se arreglará en la tarea actual si no que se adaptará a lo que se tiene presente para la creación de la vista de resultados de búsqueda. Por esto, no se intentará hacer match con el atributo *'descripsción_actividad'* ni será mostrado entre los datos de actividad en la vista de resultados de búsqueda. En resumen, este atributo será ignorado, y el *nombre de la actividad* en conjunto con el *tipo de actividad* se considerarán suficientes.

3. *(27/06)* En las instrucciones se indica que el usuario puede valorar una actividad con un puntaje dentro del intervalo [1, 7]. Aquí se limitará a una selección de los enteros en la lista (nombre no fijo) *EvalScore = {1, 2, 3, 4, 5, 6, 7}*. Esto facilitará las validaciones y solo se tendrá que hacer un único cálculo interno para mostrar la *nota promedio* de cada actividad.

4. *(27/06)* Inicialmente se había planteado hacer dos vistas, una *'searchBox.html'* y otra *'searchResults.html'* pero se optó por una única vista. Esto simplifica el cómo mostramos los resultados *mientras* el usuario escribe. Si fuese un search box que aparece sobre la vista que el usuario esté al seleccionar el botón de búsqueda, este debería tomar mucho espacio, quitando el propósito de ser de tipo popup o una pequeña sección que se abra al seleccionar el botón de búsqueda. 

Así, este botón nos llevará a una vista dedicada exclusivamente a la búsqueda de actividades. Esta mantendrá la idea del punto 1, de ser de similar estructura a la vista *'member_list.html'*.

5. *(27/06)* Como no tenemos un template *'base.html'*, agregar un botón de búsqueda de actividades que se encuentre presente en todas las vistas para que este sea accesible en cualquier parte de la página es dificultoso y hay preocupaciones de que el agregar un template de este estilo pueda romper el código actualmente funcional de las tareas anteriores.

Por esto, y como se indica en el punto (4), se tendrá una vista exclusiva para la búsqueda, y el acceso a esta se encontrará en la página de inicio, es decir, dentro de *'home.html'* se agregará un cuarto botón para acceder a la búsqueda.

6. *(28/06)* Se logra inicializar correctamente Spring Boot utilizando extención Spring Initializer.

7. *(28/06)* Se logra ejecutar Spring Boot en conjunto a los contenidos Flask correspondientes a las tareas 1, 2 y 3. Para esto se requiere tener dos pestañas de terminal. En la primera se ejecuta lo mismo que en las tareas anteriores:

*Terminal 1:* 

cd "c:/.../flask_app
flask run //o ejecutar 'python app.py'

*Terminal 2:*

$env:JAVA_HOME = "C:\Program Files\Java\jdk-26.0.1"    
cd "c:/.../spring_app/tarea4spring"
.\mvnw.cmd spring-boot:run


Finalmente, se abre desde la terminal 1 la página 'http:[//]127.0.0.1:5000'.


8. *(28/06)* Ya que se va a tener un botón 'Evaluar' para cada una de las actividades que se obtengan como resultado de la búsqueda, vamos a hacer que al interactuar con este, desaparezca, en cambio se hagan visibles dos campos. Uno que nos dejará seleccionar uno de los enteros en el intervalo [1, 7] y un nuevo botón. 'Guardar', el cual funciona como el típio 'Enviar' de cualquier formulario que hemos hecho anteriormente.

9. *(28/06)* Como el template 'searchBox.html' esta fuertemente inspirado en uno de nuestros templates anteriores, 'member_list.html', se decidió agregar una función adicional. Esta es el poder acceder a 'miembro_detalle', en donde se ven los detalles del miembro dueño de la actividad y de la actividad en si, al hacer click sobre la fila que muestra el resultado. Esto hace sentido, pues si uno está buscando una actividad uno va a querer ver más detalles de esta tras encontrarla en el buscador.

10. *(28/06)* Dado el punto anterior, se consideró agregar la función de 'Evaluar' en la vista 'miembro_detalle', pero se decidió que mejor no, ya que se debería implementar dos funciones que interactuan con la tabla 'tabla-nota' con el mismo funcionamiento en los fos frameworks, flask y spring root. Hay posibilidad de romper partes del código ya funcional agregando esta función ya que no tengo claro cómo hacerlo, además de las restricciones de tiempo.

11. *(28/06)* En la versión actual de la página/aplicación es posible 'Evaluar' una actividad múltiples veces, lo cual sería un problema en una página como la nuestra si fuera real. Como no se incorporó cuentas, no estoy seguro de cómo se podría limitar la cantidad de 'Evaluaciones' a cada actividad individual a 1. Por esto no se implementará, solamente se hará esta observación del posible problema que esto tiene.

12. *(29/06)* Como no fue posible agregar el atributo *actividad.descripcion* debido a que no fue implementada correctamente en las tareas anteriores, quedamos con un buscador que solo filtra en función de 2 atributos de la los datos obtenidos, *'actividad.nombre'* y *'comuna.nombre'*. Por esto, agregaremos un factor más a la búsqueda, el cual será sobre el atributo *'actividad.tipo'*, pues es el que lógicamente sería más útil para filtrar actividades en la vida real.