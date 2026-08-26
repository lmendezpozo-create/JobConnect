# Guía de Asistente IA (Claude / Antigravity) — JobConnect

Este archivo contiene las directivas y normas de desarrollo para los asistentes de código de Inteligencia Artificial que colaboren en el proyecto **JobConnect**.

## 1. Stack Tecnológico
- **Frontend**: HTML5 semántico, Vanilla CSS3 y JavaScript ES6+ (sin frameworks pesados como React/Vue a menos que se indique).
- **Consumo de API**: `Fetch API` asíncrona con `async/await` conectada a `https://dummyjson.com`.
- **Servidor Mock / Persistencia**: `db.json` con `json-server`.

## 2. Convenciones de Código
- Mantener nombres de funciones y variables descriptivos en español/inglés coherentes.
- Manejo estricto de errores con bloques `try/catch` para evitar fallos catastróficos en UI.
- Separación clara de responsabilidades:
  - **Servicios (`/Services`)**: Únicamente consumo de API e integración de datos.
  - **Lógica UI (`/js`)**: Manipulación del DOM y gestión de eventos.
  - **Vistas (`/pages` u `/html`)**: Estructura HTML.
  - **Estilos (`/css`)**: HSL tailored, temas oscuros/claros, diseño responsivo.

## 3. Estructura de Proyecto
- El código personal de cada desarrollador debe alojarse bajo `src/<Nombre>/` (ej: `src/Luis/`).
