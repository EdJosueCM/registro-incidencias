# 1. Título de la actividad

Gestión de versiones y automatización del despliegue de una aplicación
mediante GitHub

# 2. Objetivo

Aplicar los principios de gestión de la configuración del software
mediante el uso de herramientas de control de versiones, nomenclatura de
releases, automatización del despliegue y mejora continua, simulando el
ciclo de actualización de una aplicación.

# 3. Caso de estudio: Sistema de registro de incidencias

Una empresa de desarrollo de software ha creado una aplicación web
sencilla para registrar incidencias reportadas por sus usuarios.

Actualmente, la aplicación permite ingresar una incidencia y visualizar
su información básica. Sin embargo, la empresa necesita implementar
nuevas funcionalidades, corregir errores y organizar adecuadamente las
versiones que entrega.

Para ello, ha contratado a un equipo de desarrolladores (cada grupo de
estudiantes) que tendrá la responsabilidad de administrar el código
fuente, gestionar las versiones y automatizar la publicación de las
actualizaciones.

El reto del equipo será entregar tres versiones funcionales de la
aplicación, demostrando cómo evoluciona el software mediante un proceso
controlado de gestión de la configuración.

# 4. Desarrollo de la actividad

## Fase 1. Actividades en SCM --- 2 puntos

Crear un repositorio en GitHub, incluir a los integrantes como
colaboradores y gestionar el proyecto mediante ramas, commits y pull
requests.

Cada integrante deberá realizar al menos dos commits propios. El
repositorio deberá contener un archivo **`README.md`** con la
descripción del proyecto y las instrucciones para ejecutarlo.

## Fase 2. Formas de nombrado de releases --- 2 puntos

Aplicar versionamiento semántico **`MAJOR.MINOR.PATCH`** y crear tres
releases en GitHub:

-   **`v1.0.0`**: versión inicial, registro y listado de incidencias.
-   **`v1.1.0`**: incorporación de una funcionalidad, como filtrar
    incidencias por estado.
-   **`v1.1.1`**: corrección de un error identificado en la versión
    anterior.

Cada release deberá incluir sus notas de versión, indicando cambios,
mejoras y correcciones.

## Fase 3. Despliegue de releases --- 3 puntos

Configurar un flujo de trabajo mediante GitHub Actions para ejecutar
automáticamente una validación de la aplicación y, si es exitosa,
desplegarla en GitHub Pages al publicar los cambios en la rama
principal.

Los estudiantes deberán demostrar que la aplicación está disponible
mediante una URL pública y que el historial de ejecución del flujo de
trabajo es correcto.

## Fase 4. Releases en mejora continua --- 2 puntos

Registrar una incidencia (Issue) que describa un error o una oportunidad
de mejora. El equipo deberá asignar un responsable, implementar la
corrección mediante una rama y un pull request, validar su
funcionamiento y documentar la solución dentro del release **`v1.1.1`**.

Presentar evidencias del funcionamiento antes y después de la
corrección.

# 5. Productos que deberán entregar

Cada grupo presentará un documento PDF que contenga:

1.  Portada con nombres de los integrantes.
2.  Enlace al repositorio de GitHub.
3.  Capturas de las ramas, commits y pull requests.
4.  Evidencias de las tres releases creadas y sus notas.
5.  Captura del flujo ejecutado mediante GitHub Actions.
6.  Enlace público de la aplicación desplegada.
7.  Evidencia de la incidencia corregida y breve reflexión sobre la
    mejora continua.
