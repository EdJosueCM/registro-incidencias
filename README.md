# Registro de Incidencias

Aplicación web sencilla para que los usuarios de una empresa de software registren las incidencias que encuentran y el equipo pueda consultarlas.

Este proyecto se usa para practicar **gestión de la configuración del software**: control de versiones con ramas y pull requests, versionado semántico, despliegue automático con GitHub Actions y mejora continua a partir de Issues.

## Funcionalidades

- Registrar incidencias con título, descripción y prioridad.
- Listar las incidencias registradas.
- Los datos se guardan en el navegador (`localStorage`).

## Requisitos

- Un navegador moderno.
- [Node.js](https://nodejs.org/) 20 o superior (solo para ejecutar las pruebas o el servidor local).

## Ejecución local

```bash
git clone https://github.com/EdJosueCM/registro-incidencias.git
cd registro-incidencias

# Servir la aplicación en http://localhost:3000
npm start
```

También se puede usar cualquier servidor estático, por ejemplo `python3 -m http.server 8000`.

> La app usa módulos ES, así que hay que abrirla desde un servidor; abrir `index.html` con doble clic no funciona.

## Pruebas

```bash
npm test
```

## Flujo de trabajo

- `main` es la rama estable y la que se despliega.
- Cada cambio se hace en su propia rama (`feature/...`, `fix/...`, `ci/...`) y entra a `main` por pull request.
- Las versiones siguen [SemVer](https://semver.org/lang/es/) (`MAJOR.MINOR.PATCH`) y se publican como releases de GitHub.

## Integración y despliegue continuo

El workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) tiene dos jobs:

1. **Validar**: revisa la sintaxis de los scripts y ejecuta `npm test`. Corre en cada pull request y en cada push a `main`.
2. **Desplegar**: solo si la validación pasa y el cambio llegó a `main`, publica la app en GitHub Pages.

Aplicación publicada: **https://edjosuecm.github.io/registro-incidencias/**
