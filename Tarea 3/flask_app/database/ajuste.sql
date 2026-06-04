
USE `tarea2`;

-- 1) Pasar a VARCHAR para poder reescribir valores sin depender del ENUM antiguo.
ALTER TABLE `actividad` MODIFY COLUMN `dia` VARCHAR(20) NOT NULL;

-- 2) Normalizar datos existentes (acentuados o ya ASCII).
UPDATE `actividad` SET `dia` = 'miercoles' WHERE `dia` IN ('miércoles', 'miercoles');
UPDATE `actividad` SET `dia` = 'sabado' WHERE `dia` IN ('sábado', 'sabado');

-- 3) Volver a ENUM con la lista única en ASCII.
ALTER TABLE `actividad`
  MODIFY COLUMN `dia` ENUM(
    'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'
  ) NOT NULL;
