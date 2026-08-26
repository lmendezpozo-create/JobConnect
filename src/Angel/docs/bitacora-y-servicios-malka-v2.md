# Bitácora Técnica de Desarrollo y Código Base: Malka (Local JSON v2) [1, 11]

Este documento contiene la implementación del código de servicios frontend adaptados a la **arquitectura Local JSON** y la **Bitácora de consultas técnicas de Malka** resueltas por Gemini Notebook durante el **Día 2 de Desarrollo** [11, 12].

---

## 1. Implementación de Servicios Locales (HTML, CSS y JS Vanilla)

Para superar el problema de persistencia ficticia de DummyJSON y asegurar que la plataforma sea autónoma, el equipo **Malka** diseñó servicios que se conectan a **semillas JSON locales** y administran los estados de datos dinámicos usando **`localStorage`** [6, 7, 9].

### 1.1. Servicio de Autenticación (`src/services/authService.js`) [7, 8]
Este servicio valida las credenciales de los reclutadores consultando el archivo de base de datos local `usuarios.json` de forma asíncrona [5, 6, 8]:

```javascript
/**
 * Servicio de Autenticación Local con JSON - Malka Dev Team
 */
export const authService = {
    /**
     * Inicia sesión validando contra usuarios.json semilla
     * @param {string} username - Ejemplo: 'emilys'
     * @param {string} password - Ejemplo: 'emilyspass'
     */
    async login(username, password) {
        try {
            // Fetch asíncrono al JSON local semilla [8]
            const response = await fetch('/src/data/usuarios.json');
            if (!response.ok) {
                throw new Error('No se pudo cargar el archivo de configuración de usuarios.');
            }
            const usuarios = await response.json();

            // Buscar coincidencia en la base JSON local [5]
            const userMatch = usuarios.find(u => u.username === username && u.password === password);

            if (!userMatch) {
                throw new Error('Credenciales incorrectas. Verifique su usuario y contraseña.');
            }

            // Generar un token de sesión ficticio simulando un JWT (Base64)
            const mockToken = btoa(`${username}_session_${Date.now()}`);

            // Almacenar sesión y datos básicos del reclutador de forma segura [4]
            localStorage.setItem('jobconnect_token', mockToken);
            localStorage.setItem('jobconnect_user', JSON.stringify({
                username: userMatch.username,
                firstName: userMatch.firstName,
                lastName: userMatch.lastName,
                image: userMatch.image || '../assets/img/default-user.png'
            }));

            return { success: true, token: mockToken, user: userMatch };
        } catch (error) {
            console.error('Error en authService.login:', error.message);
            throw error; // Propaga a la UI para retroalimentar al usuario [6]
        }
    },

    /**
     * Elimina las claves de sesión y redirige al login [5, 6]
     */
    logout() {
        localStorage.removeItem('jobconnect_token');
        localStorage.removeItem('jobconnect_user');
        window.location.href = 'login.html';
    },

    /**
     * Comprueba si existe un token activo [5]
     */
    isAuthenticated() {
        return !!localStorage.getItem('jobconnect_token');
    },

    /**
     * Retorna el token actual
     */
    getToken() {
        return localStorage.getItem('jobconnect_token');
    }
};
```

---

### 1.2. Motor de Base de Datos Local JSON (`src/services/apiService.js`) [7, 8]
Este cliente API simula a la perfección un backend REST. El primer `GET` descarga el archivo `.json` semilla y lo carga en `localStorage` como base de datos dinámica. Los métodos de escritura (`POST`, `PUT`, `PATCH`, `DELETE`) alteran de forma real los datos en `localStorage`, devolviendo promesas asíncronas para imitar latencia de red [6, 8, 9].

```javascript
import { authService } from './authService.js';

// Mapeo de módulos a sus archivos semilla JSON locales
const SEED_PATHS = {
    candidatos: '/src/data/candidatos.json',
    vacantes: '/src/data/vacantes.json',
    empresas: '/src/data/empresas.json',
    postulaciones: '/src/data/postulaciones.json',
    entrevistas: '/src/data/entrevistas.json',
    tareas: '/src/data/tareas.json'
};

/**
 * Cliente de Base de Datos Local JSON - Malka Dev Team
 */
export const apiService = {
    /**
     * Inicializa un módulo cargando su JSON semilla en localStorage si no existe
     * @param {string} modulo - Nombre de la entidad (ej: 'candidatos')
     */
    async initDatabase(modulo) {
        const storageKey = `jobconnect_${modulo}`;
        if (!localStorage.getItem(storageKey)) {
            try {
                // Fetch asíncrono para leer el archivo semilla original [8]
                const response = await fetch(SEED_PATHS[modulo]);
                if (!response.ok) throw new Error(`Fallo al cargar semilla de ${modulo}`);
                const seedData = await response.json();
                localStorage.setItem(storageKey, JSON.stringify(seedData));
            } catch (error) {
                console.error(`Error inicializando base local de ${modulo}:`, error);
                localStorage.setItem(storageKey, JSON.stringify([])); // Array vacío de respaldo
            }
        }
    },

    /**
     * Simula la latencia de red de un servidor asíncrono (200ms)
     */
    delay(ms = 200) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    /**
     * Obtiene el listado completo de un módulo (GET) [6]
     */
    async get(modulo) {
        await this.initDatabase(modulo);
        await this.delay();
        
        const storageKey = `jobconnect_${modulo}`;
        return JSON.parse(localStorage.getItem(storageKey));
    },

    /**
     * Crea un nuevo registro con ID auto-incremental (POST) [6]
     */
    async post(modulo, data) {
        await this.initDatabase(modulo);
        await this.delay();
        
        const storageKey = `jobconnect_${modulo}`;
        const items = JSON.parse(localStorage.getItem(storageKey));
        
        const newItem = {
            id: items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1,
            ...data
        };
        
        items.push(newItem);
        localStorage.setItem(storageKey, JSON.stringify(items));
        return newItem;
    },

    /**
     * Edición total por ID (PUT) [6]
     */
    async put(modulo, id, data) {
        await this.initDatabase(modulo);
        await this.delay();
        
        const storageKey = `jobconnect_${modulo}`;
        const items = JSON.parse(localStorage.getItem(storageKey));
        const index = items.findIndex(item => item.id === parseInt(id));
        
        if (index === -1) throw new Error(`Registro con ID ${id} no encontrado.`);
        
        // Sobrescribir registro completo, respetando el ID original
        items[index] = { id: parseInt(id), ...data };
        localStorage.setItem(storageKey, JSON.stringify(items));
        return items[index];
    },

    /**
     * Edición parcial de atributos (PATCH) [6]
     */
    async patch(modulo, id, patchData) {
        await this.initDatabase(modulo);
        await this.delay();
        
        const storageKey = `jobconnect_${modulo}`;
        const items = JSON.parse(localStorage.getItem(storageKey));
        const index = items.findIndex(item => item.id === parseInt(id));
        
        if (index === -1) throw new Error(`Registro con ID ${id} no encontrado.`);
        
        // Mezclar atributos manteniendo los campos anteriores
        items[index] = { ...items[index], ...patchData };
        localStorage.setItem(storageKey, JSON.stringify(items));
        return items[index];
    },

    /**
     * Elimina físicamente un elemento por ID (DELETE) [6]
     */
    async delete(modulo, id) {
        await this.initDatabase(modulo);
        await this.delay();
        
        const storageKey = `jobconnect_${modulo}`;
        const items = JSON.parse(localStorage.getItem(storageKey));
        const filteredItems = items.filter(item => item.id !== parseInt(id));
        
        if (items.length === filteredItems.length) {
            throw new Error(`No se pudo eliminar: ID ${id} no encontrado.`);
        }
        
        localStorage.setItem(storageKey, JSON.stringify(filteredItems));
        return { success: true, idDeleted: id };
    }
};
```

---

## 2. Bitácora de Dudas Técnicas Resueltas por Gemini Notebook [12]

Durante la migración a la arquitectura Local JSON, el equipo de desarrollo de **Malka** consultó al asistente para resolver dudas clave que garantizan la viabilidad técnica del entregable final [11]:

### 🔍 Duda Técnica 1: «¿Por qué nos arroja error 405 (Method Not Allowed) cuando intentamos hacer POST, PUT o DELETE directo al archivo JSON de candidatos?»
*   **Diagnóstico:** El servidor web local (como Live Server de VS Code) está configurado para servir recursos estáticos [7]. Cuando haces una petición `POST` o `PUT` apuntando directamente a `/src/data/candidatos.json`, el servidor rechaza la solicitud porque los archivos estáticos en el disco no se pueden sobrescribir mediante solicitudes HTTP del navegador.
*   **Solución implementada:** 
    1.  Utilizar la petición `GET` únicamente para descargar la **semilla de datos inicial** del archivo `.json` de forma pasiva [6].
    2.  Guardar esa estructura inicial en la base de datos local `localStorage` del cliente [4].
    3.  Desviar todos los métodos de escritura (`POST`, `PUT`, `PATCH`, `DELETE`) para que manipulen dinámicamente el estado JSON almacenado en `localStorage` [6]. Con esto logramos un CRUD 100% interactivo, local y persistente que funciona en cualquier navegador sin dependencias [6, 9].

---

### 🔍 Duda Técnica 2: «¿Cómo controlamos que las rutas de administración estén debidamente protegidas y redirijan al login sin causar un bucle infinito?» [5]
*   **Diagnóstico:** Al cargar cada módulo HTML, es mandatorio verificar de inmediato si existe una sesión válida [5]. Si evaluamos la presencia del token después de que la página se pinte, se corre el riesgo de filtrar información privada por unos milisegundos. Además, si el script de validación se coloca incorrectamente en la página del login, redirigirá al login constantemente.
*   **Solución de Malka:** 
    Añadir el script de protección como un bloque inline bloqueante en la cabecera `<head>` de todas las páginas protegidas, exceptuando `login.html`:
    ```javascript\n    // Ubicar en <head> de candidatos.html, vacantes.html, etc.\n    (function() {\n        const token = localStorage.getItem('jobconnect_token');\n        if (!token) {\n            alert('Acceso no autorizado. Redirigiendo a login...');\n            window.location.href = 'login.html'; // Redirección segura [5]\n        }\n    })();\n    ```

---

### 🔍 Duda Técnica 3: «¿Cómo manejamos la diferencia de comportamiento entre PUT y PATCH al escribir la lógica en nuestro motor JSON local?» [6]
*   **Diagnóstico:** En un desarrollo REST, `PUT` destruye el recurso existente y lo reemplaza por lo que viene en la petición, mientras que `PATCH` mezcla las propiedades nuevas [6]. De no implementarse con precisión en nuestro cliente, podríamos vaciar registros accidentalmente al editar un perfil.
*   **Solución implementada:** 
    *   **En PUT:** Tomamos las propiedades enviadas en la petición y las guardamos como un objeto completo (reemplazando al anterior), forzando a que la vista envíe todas las propiedades actualizadas.
    *   **En PATCH:** Empleamos la desestructuración de objetos de JavaScript (`{ ...oldItem, ...newData }`) [6]. Esto recupera el registro original de la base JSON y actualiza exclusivamente las propiedades recibidas (ej. actualizar únicamente la propiedad `completado` en una tarea de `/todos` o la propiedad `status` en una postulación) [3, 4].
