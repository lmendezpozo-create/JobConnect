# Bitácora Técnica de Desarrollo y Código Base: Malka [1, 11]

Este documento compila el código base de servicios frontend y la **Bitácora de consultas de Malka a Gemini Notebook** para resolver los bloqueos técnicos más complejos durante el **Día 2 de Desarrollo** [11, 12].

---

## 1. Código Base de Servicios Frontend

### 1.1. `src/services/authService.js` [7, 8]
Este servicio centraliza el flujo de autenticación, almacenamiento seguro de sesión y salida de la plataforma utilizando `async/await` y `fetch` [4, 5, 6, 8]:

```javascript
/**
 * Servicio de Autenticación para JobConnect - Malka Dev Team
 */
const BASE_URL = 'https://dummyjson.com';

export const authService = {
    /**
     * Inicia sesión con credenciales contra DummyJSON
     * @param {string} username - Ejemplo: 'emilys'
     * @param {string} password - Ejemplo: 'emilyspass'
     * @returns {Promise<object>} Datos del usuario autenticado y su token
     */
    async login(username, password) {
        try {
            const response = await fetch(`${BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                    expiresInMins: 60 // Duración del token
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Credenciales inválidas');
            }

            const data = await response.json();
            
            // Guardar el token de forma segura en localStorage [4]
            localStorage.setItem('jobconnect_token', data.token);
            localStorage.setItem('jobconnect_user', JSON.stringify({
                username: data.username,
                firstName: data.firstName,
                lastName: data.lastName,
                image: data.image
            }));

            return data;
        } catch (error) {
            console.error('Error en authService.login:', error.message);
            throw error; // Re-lanzar para que la UI dé feedback [6]
        }
    },

    /**
     * Elimina el token de sesión del almacenamiento local [6]
     */
    logout() {
        localStorage.removeItem('jobconnect_token');
        localStorage.removeItem('jobconnect_user');
        window.location.href = 'login.html'; // Redirección
    },

    /**
     * Verifica si existe una sesión activa [5]
     * @returns {boolean}
     */
    isAuthenticated() {
        return !!localStorage.getItem('jobconnect_token');
    },

    /**
     * Obtiene el token guardado
     * @returns {string|null}
     */
    getToken() {
        return localStorage.getItem('jobconnect_token');
    }
};
```

---

### 1.2. `src/services/apiService.js` [7, 8]
Módulo unificado para realizar peticiones HTTP seguras y simplificadas hacia DummyJSON, inyectando cabeceras `Authorization` y manejando errores de manera tolerante [5, 6, 8]:

```javascript
import { authService } from './authService.js';

const BASE_URL = 'https://dummyjson.com';

/**
 * Cliente API Genérico - Malka Dev Team
 */
export const apiService = {
    /**
     * Construye las cabeceras requeridas, agregando el token si existe [5]
     */
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };
        const token = authService.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`; // [5]
        }
        return headers;
    },

    /**
     * Método genérico para peticiones HTTP
     */
    async request(endpoint, options = {}) {
        const url = `${BASE_URL}${endpoint}`;
        const config = {
            ...options,
            headers: {
                ...this.getHeaders(),
                ...options.headers
            }
        };

        try {
            const response = await fetch(url, config);
            
            // Si la API detecta un token inválido o expirado (401 / 403), desautenticar
            if (response.status === 401 || response.status === 403) {
                authService.logout();
                throw new Error('Sesión expirada o no autorizada. Redirigiendo...');
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Error HTTP: ${response.status}`);
            }

            // DummyJSON retorna JSON en casi todas sus respuestas
            return await response.json();
        } catch (error) {
            console.error(`Error en API Request (${url}):`, error.message);
            throw error; // Propaga el error para la retroalimentación en UI [6, 8]
        }
    },

    /**
     * Peticiones GET
     */
    get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    },

    /**
     * Peticiones POST (Creación de registros)
     */
    post(endpoint, body) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(body)
        });
    },

    /**
     * Peticiones PUT (Reemplazo total)
     */
    put(endpoint, body) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body)
        });
    },

    /**
     * Peticiones PATCH (Modificación parcial)
     */
    patch(endpoint, body) {
        return this.request(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(body)
        });
    },

    /**
     * Peticiones DELETE (Eliminación)
     */
    delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }
};
```

---

## 2. Bitácora de Dudas Técnicas Resueltas con Gemini Notebook [12]

Durante la fase de codificación, el equipo **Malka** enfrentó bloqueos clave. A continuación, se detalla la resolución teórica y práctica provista por nuestro asistente [12]:

### 🔍 Duda Técnica 1: «¿Por qué mi petición POST me devuelve un error o llega vacía a DummyJSON?»
*   **Diagnóstico:** Al realizar operaciones `POST` o `PUT`/`PATCH`, no basta con pasar el objeto directamente en la propiedad `body` de `fetch`. JavaScript enviará el objeto sin serializar (lo que resulta en `[object Object]` en el payload) o, si no se especifica el tipo de contenido, el servidor no sabrá cómo interpretarlo.
*   **Solución implementada:**
    1.  **Serializar el body:** Transformar siempre el objeto JS a una cadena de texto JSON usando `JSON.stringify(body)`.
    2.  **Encabezado de Contenido:** Declarar explícitamente `'Content-Type': 'application/json'` en los headers. Esto le indica a DummyJSON que el payload es JSON estructurado [5].

---

### 🔍 Duda Técnica 2: «¿Cómo protejo mis páginas secundarias (candidatos.html, vacantes.html) si un usuario intenta ingresar directamente escribiendo la URL sin token?» [5]
*   **Diagnóstico:** Como JobConnect es un sistema únicamente de frontend, el servidor web local no tiene un middleware que restrinja el acceso a archivos HTML físicos [7]. La validación debe ocurrir del lado del cliente inmediatamente al cargar el documento (en la primera línea de JS que se ejecute).
*   **Solución implementada:**
    En la parte superior de cada script de página, antes de inicializar la interfaz de usuario, se realiza la validación:
    ```javascript
    import { authService } from '../services/authService.js';

    // Comprobación inmediata
    if (!authService.isAuthenticated()) {
        alert('Acceso denegado. Debes iniciar sesión primero.');
        window.location.href = 'login.html'; // Redirección instantánea [5]
    }
    ```

---

### 🔍 Duda Técnica 3: «¿Por qué DummyJSON simula las operaciones pero cuando hago un DELETE o un POST y luego consulto el listado con GET, no veo mis cambios guardados?» [9]
*   **Diagnóstico:** DummyJSON es una API de pruebas pública y estática [9]. Permitir que miles de estudiantes escriban, modifiquen o borren registros reales saturaría y corrompería el servidor. Por diseño, al enviar un `POST`, la API responde con un estado exitoso `201 Created` y te devuelve el objeto ficticio creado con un ID autogenerado, pero **no persiste** nada de forma real en su base de datos [9].
*   **Solución de Malka en el Frontend:**
    Para asegurar una UX realista en JobConnect sin requerir backend propio:
    1.  **Estado en Memoria:** Malka maneja un estado local (un array de objetos en JavaScript) al cargar la página por primera vez.
    2.  **Simulación Local Post-Fetch:** Al realizar exitosamente un `DELETE` a DummyJSON (que responderá con un código exitoso ficticio), el JS de la página de Malka filtra el array local en memoria eliminando el elemento y actualiza la tabla del frontend de inmediato [6]. Así, el usuario final percibe la eliminación real.

---

### 🔍 Duda Técnica 4: «¿Cómo solucionamos el error de CORS (Cross-Origin Resource Sharing) en desarrollo local?»
*   **Diagnóstico:** El error de CORS ocurre cuando un script frontend ejecutado en un puerto de desarrollo (ej. `http://localhost:5500` mediante Live Server) intenta comunicarse con un servidor en otro dominio (como `https://dummyjson.com`) y el servidor o el navegador detectan que las políticas de intercambio de recursos de origen cruzado fallan por cabeceras erróneas o protocolos mal estructurados.
*   **Solución aplicada:**
    DummyJSON tiene cabeceras CORS habilitadas por defecto para recibir peticiones de cualquier origen (`Access-Control-Allow-Origin: *`). Para evitar que el navegador interfiera:
    1.  Asegurar que todas las llamadas `fetch` apunten de forma absoluta a direcciones con protocolo seguro HTTPS.
    2.  Evitar añadir cabeceras personalizadas de sistema que DummyJSON no tenga permitidas (como `X-Custom-Header`). Mantener cabeceras estándar: `Content-Type` y `Authorization` [5].
