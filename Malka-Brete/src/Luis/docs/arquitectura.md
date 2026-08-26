# Arquitectura del Módulo de Postulaciones — Luis

## 1. Visión General
El módulo de **Postulaciones** gestiona las aplicaciones a ofertas de empleo dentro de JobConnect. Interactúa con el endpoint `/posts` de la API pública DummyJSON.

## 2. Componentes

### 2.1 Servicio (`postulacionesService.js`)
Ubicación: `src/Luis/Services/postulacionesService.js`
- Responsable de realizar las llamadas `fetch` (GET, POST, PATCH, DELETE).
- Transforma y valida los datos recibidos de la API.

### 2.2 Controlador UI (`postulaciones.js`)
Ubicación: `src/Luis/js/Postulaciones/postulaciones.js`
- Maneja los eventos de usuario en el formulario y tabla de postulaciones.
- Actualiza dinámicamente el DOM.

### 2.3 Vista HTML (`postulaciones.html`)
Ubicación: `src/Luis/pages/Postulaciones/postulaciones.html`
- Renderiza la interfaz gráfica del módulo de postulaciones.

### 2.4 Estilos CSS (`postulaciones.css`)
Ubicación: `src/Luis/css/Postulaciones/postulaciones.css`
- Proporciona el diseño responsivo e interfaz moderna.
