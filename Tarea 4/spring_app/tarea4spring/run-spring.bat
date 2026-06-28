@echo off
REM Ejecutar Spring Boot (Tarea 4) desde la carpeta del proyecto.
cd /d "%~dp0"

if defined JAVA_HOME (
    echo Usando JAVA_HOME=%JAVA_HOME%
) else (
    if exist "C:\Program Files\Java\jdk-26.0.1\bin\java.exe" (
        set "JAVA_HOME=C:\Program Files\Java\jdk-26.0.1"
        echo JAVA_HOME no estaba definido. Usando %JAVA_HOME%
    ) else (
        echo ADVERTENCIA: Defina JAVA_HOME apuntando a JDK 17 o superior.
    )
)

call mvnw.cmd spring-boot:run
