# Changelog

Todos los cambios relevantes del proyecto se registran aquí.
El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y el proyecto usa [Versionado Semántico](https://semver.org/lang/es/).

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

[1.1.0]: https://github.com/EdJosueCM/registro-incidencias/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/EdJosueCM/registro-incidencias/releases/tag/v1.0.0
