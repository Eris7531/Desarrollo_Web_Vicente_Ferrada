# Torpedo Spring Auxiliar 10

**Inicializar**
CHEAT SHEET Aux 10:

- Instalar Java 24
- Spring Initializer --> (Elegir versión 3.5.0)
--> Group: Auxiliar // AQUI PUEDEN ELEGIR LO QUE QUIERAN PERO DEBERAN CAMBIAR LOS IMPORTS
--> Name/Artifact: Auxiliar
--> Packaging Jar y versión java 24

Dependencias:
--> DevTools (Nos da live reload y otras funcionalidades)
--> Spring Web (Requisito básico para trabajarlo en la web)
--> Thymeleaf (Es como JINJA)
--> Spring Data JPA (Es como una ORM)
--> MySQL Driver (Driver para conectarse)
--> Validate (Necesario para ciertas validaciones de los modelos del backend)

AHORA: Le damos a GENERATE --> Nos da un .zip, lo abrimos y vemos en VSCode

ALTERNATIVA: Hacerlo desde VSCode

- Nos creamos un perfil de VSCode exclusivo para Java
--> Instalarle extensiones: Extension Pack for Java (Microsoft)
--> Spring Initializr Java Support

Ahora, hacemos cntrl + SHIFT + p (O command + shift + p en MAC)

Buscamos spring Initializer y lo seleccionamos. Seguimos el mismo procedimiento de seleccionar versiones, librerias, etc.

## Resumen

**Thymeleaf:** engine de templates de Spring Boot. Se basa en definir "fragmentos" para luego reutilizarlos. 

Supone que en la carpeta `static` tienes una carpeta `fragments` y un archivo `index.html`. En `fragments` se encuentran todos tus fragmentos, en particular `ejemplo.html`. 

**Como definir un fragmento:** 
```html
<!-- ejemplo.html -->
<div th:fragment="ex-frag">
    <p>HOLA SOY UN FRAGMENTO XD</p>
</div>
```

**Como incluir un fragmento:**
```html
<!-- index.html -->
<!-- codigo HTML del index [...] -->
<div th:replace="~{fragments/ejemplo :: ex-frag}"></div>
<!-- codigo HTML del index [...] -->
```

**Como definir un fragmento "variable":**
```html
<!-- ejemplo.html -->
<div th:fragment="ex-frag-var(valor)">
    <p>HOLA SOY UN FRAGMENTO XD</p>
    <p th:text="${valor}"></p>
</div>
```

**Como iterar sobre una lista**:

```html
<!-- index.html -->
<!-- codigo HTML del index [...] -->
<div th:each=" elemento : ${lista}">
    <!-- instanciemos fragmentos!! -->
    <div th:replace="~{fragments/ejemplo :: ex-frag-var(${elemento})}"></div>
</div>
<!-- codigo HTML del index [...] -->
```

**Como hacer condiciones**:
```html
<!-- index.html -->
<!-- código HTML del index [...] -->
<div th:each="elemento : ${lista}">
    <!-- Mostrar solo si se cumple una condición -->
    <div th:if="${elemento.activo}">
        <p>Elemento activo: <span th:text="${elemento.nombre}"></span></p>
    </div>

    <!-- O mostrar algo distinto si la condición no se cumple -->
    <div th:unless="${elemento.activo}">
        <p>Elemento inactivo</p>
    </div>
</div>
<!-- código HTML del index [...] -->

```

**Resumen MVC en Spring**:
1. Modelo: Carpeta 'confession' en el aux. Aquí definimos los modelos de JPA al igual que definimos en SQLAlchemy. Podemos definir un repository de labores que se pueden consultar a la BD.
2. Vista: Son simplemente los templates + Thymeleaf. Igual que templates + Jinja en Flask
3. Controlador: Son todo lo que tiene que ver con la lógica de la app. Tenemos controllers donde definimos rutas y la lógica. Creamos servicios para funcionar como herramientas de los controlodares. Osea, los servicios se encargan de usar a los modelos en lo que quieran hacer.

**Bean:** En el contexto de Spring Boot, un bean es un objeto que Spring instancia, ensambla y gestiona. Los beans se crean con los metadatos de configuración que proporciona el desarrollador.

**@Autowired:** Anotacion que delega a Spring la instanciacion de una dependencia (un objeto de una clase X) que se necesita en una clase Y.

**Arquitectura N-Tier:** 
Dividir el procesamiento en N etapas. El trabajo de cada etapa lo realiza una clase especifica. En este caso usaremos una arquitectura 3-Tier:

Request cliente -> Controller layer -> Service layer ->  Database layer

Response servidor <- Controller layer <- Service layer <- Database layer
