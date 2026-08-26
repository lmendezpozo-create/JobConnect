# Changelog — JobConnect

Todos los cambios notables en este proyecto serán documentados en este archivo.

## [1.0.0] - 2026-08-26

### Añadido
- Documentación inicial del proyecto: Requerimientos, Arquitectura, Guía de Contribución y Changelog.
- Módulo de **Postulaciones** desarrollado por Luis (HTML, CSS y JS con integración DummyJSON `/posts`).
- Módulo de **Empresas / Candidatos** integrado.
- Servicios API decoupled en `/Services` utilizando `async/await` y `fetch`.

### Cambios
- Reorganización de la estructura de carpetas por integrante en `src/` (`src/Luis/`, `src/Angel/`, `src/Moises/`, etc.).
- Normalización de la persistencia de datos mediante `db.json`.
