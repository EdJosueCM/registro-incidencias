# Changelog

Todos los cambios relevantes del proyecto se registran aquí.
El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y el proyecto usa [Versionado Semántico](https://semver.org/lang/es/).

## [1.2.0] - 2026-11-13

### Añadido
- Medidor del avance de cada incidencia: Abierta → En progreso → Cerrada.
- Mensajes de error junto a cada campo del formulario.
- Aviso de confirmación al registrar una incidencia o cambiar su estado.
- Fechas relativas en el listado de incidencias.
- Se respetan los saltos de línea de la descripción.
- Enlace a las notas de versión desde la etiqueta de versión.

### Cambiado
- Rediseño de la interfaz con panel de registro fijo y lista de incidencias (PR [#9](https://github.com/EdJosueCM/registro-incidencias/pull/9)).
- Filtro por estado en pestañas, con el número de incidencias de cada estado.
- Selector de prioridad con el criterio de cada nivel.

### Corregido
- El script de pruebas (`npm test`) fallaba con Node 22 o superior (PR [#10](https://github.com/EdJosueCM/registro-incidencias/pull/10)).

## [1.1.1] - 2026-11-12

### Corregido
- El filtro **Todos** dejaba la lista vacía después de haber filtrado por otro estado ([#6](https://github.com/EdJosueCM/registro-incidencias/issues/6), PR [#7](https://github.com/EdJosueCM/registro-incidencias/pull/7)).

### Añadido
- Pruebas de regresión para el filtro con valor `todos` o desconocido.

## [1.1.0] - 2026-11-12

### Añadido
- Filtro de incidencias por estado (Todos, Abierta, En progreso, Cerrada).
- Botón para avanzar el estado de una incidencia: Abierta → En progreso → Cerrada.
- Pruebas unitarias para el filtro y el cambio de estado.

## [1.0.0] - 2026-11-12

### Añadido
- Registro de incidencias con título, descripción y prioridad (baja, media, alta).
- Validación del formulario con mensajes de error.
- Listado de incidencias ordenado de la más reciente a la más antigua, con contador.
- Persistencia de datos en el navegador (`localStorage`).
- Pruebas unitarias con `node --test`.
- Workflow de GitHub Actions que valida la app y la despliega en GitHub Pages.

[1.2.0]: https://github.com/EdJosueCM/registro-incidencias/compare/v1.1.1...v1.2.0
[1.1.1]: https://github.com/EdJosueCM/registro-incidencias/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/EdJosueCM/registro-incidencias/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/EdJosueCM/registro-incidencias/releases/tag/v1.0.0
