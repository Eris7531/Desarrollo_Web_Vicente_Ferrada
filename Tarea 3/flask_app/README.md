Deciciones de diseño:

1. Se unieron en el from de registrar miembros y de registrar actividad, pues se indica así en el enunciado.
2. Al unificar los forms, se debió implementar formas de que se pueda agregar actividades por un día individual, contrario a lo que se tenía antes en la tarea 1.
3. Ahora si se registra un miembro con los mismos datos a uno ya existete, no se agrega una vez más, si no que solo se agrega la actividad con el miembro\_id igual a uno ya existente.
4. Se pueden borrar actividades, y si un miembro queda sin actividades, este no es borrado de la base de datos, reflejando una red solcial o aplicacion en donde se tiene usuarios, los cuales no tiene que estar obligados a tener material dentro del servidor para mantener su estado de usuario / poseción de cuenta.



NOTA IMPORTANTE: Al crear el segundo branch, el de Tarea2, tuve problemas, y se me borraron la mayoría de los archivos y no logré recuperar todos al momento de la entrega, por lo que hubieron errores que había solucionado antes ahora no funcionan al 100%:

1. Error al registrar actividades en miércoles / sábado por desajuste tildes entre sabado y miercoles. -> solucionado con modificación a tarea2.sql o al aplicar el archivo 'ajuste.sql'. 

