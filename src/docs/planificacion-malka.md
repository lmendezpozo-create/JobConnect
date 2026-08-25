# Documento de Planificación: Proyecto JobConnect
**Desarrollado por: Malka (Equipo de 5 Integrantes)** [1]

Este documento constituye el entregable de la **Fase de Planificación (Día 1)** para el desarrollo de la plataforma de empleabilidad **JobConnect**, diseñada e implementada por la agencia de desarrollo **Malka** [1, 11].

---

## 1. Descripción del Sistema
**JobConnect** es un panel de administración web interactivo (desarrollado exclusivamente en el frontend) diseñado para digitalizar y optimizar la gestión operativa de una empresa de empleabilidad [2]. El sistema centraliza el control de seis entidades clave del negocio: candidatos, vacantes, empresas clientes, postulaciones, entrevistas y tareas de reclutadores [2].

Para simular la persistencia de datos de manera eficiente, el sistema consume los servicios de la API pública **DummyJSON** (https://dummyjson.com) [3]. Dado que DummyJSON simula operaciones de escritura (devolviendo el objeto creado o modificado sin alterar la base de datos real del servidor), la plataforma permite realizar operaciones de manera segura y fluida, ideal para entornos de práctica profesional [9].

---

## 2. Tabla de Módulos y Endpoints
A continuación, se detalla el mapeo de los recursos de **DummyJSON** a las entidades del dominio de empleabilidad de **JobConnect** junto con los métodos HTTP que implementará el equipo **Malka** [3, 4]:

| # | Módulo del Negocio | Recurso (DummyJSON) | Métodos HTTP a Implementar | Descripción Funcional |
|---|--------------------|---------------------|----------------------------|-----------------------|
| **1** | **Candidatos** [3] | `/users` [3] | `GET` · `POST` · `PUT` · `PATCH` · `DELETE` [3] | Gestión de perfiles profesionales de los postulantes. |
| **2** | **Vacantes** [3] | `/products` [3] | `GET` · `POST` · `PUT` · `PATCH` · `DELETE` [3] | Catálogo de ofertas de trabajo y especificaciones técnicas. |
| **3** | **Empresas clientes** [4] | `/carts` [4] | `GET` · `POST` · `PUT` · `DELETE` [4] | Control de cuentas corporativas y solicitudes de reclutamiento. |
| **4** | **Postulaciones** [4] | `/posts` [4] | `GET` · `POST` · `PATCH` · `DELETE` [4] | Seguimiento de la postulación de un candidato a una vacante. |
| **5** | **Entrevistas / notas** [4] | `/comments` [4] | `GET` · `POST` · `PATCH` · `DELETE` [4] | Registro del feedback del reclutador y notas de entrevistas. |
| **6** | **Tareas del reclutador** [4] | `/todos` [4] | `GET` · `POST` · `PATCH` · `DELETE` [4] | Lista de tareas pendientes diarias del reclutador (To-Do). |

---

## 3. Requerimientos del Sistema

### 3.1. Requerimientos Funcionales (RF) [5]
El sistema de JobConnect cumple estrictamente con los siguientes requisitos del negocio [5, 6, 7]:

*   **RF-01 (Autenticación):** El sistema debe permitir a un usuario iniciar sesión con usuario y contraseña contra el endpoint `/auth/login` de DummyJSON [5].
*   **RF-02 (Token en cabeceras):** Almacenar el token de sesión y utilizarlo automáticamente en las peticiones que lo requieran mediante el encabezado `Authorization: Bearer <token>` [5].
*   **RF-03 (Protección de Rutas):** Restringir el acceso a las vistas de los módulos si el usuario no cuenta con un token de sesión válido [5].
*   **RF-04 (Cierre de Sesión):** Permitir la desautenticación borrando de forma segura el token almacenado [6].
*   **RF-05 (Lectura de Módulos):** Listar (`GET`) en pantalla los registros existentes de cada uno de los 6 módulos del negocio [6].
*   **RF-06 (Creación de Registros):** Permitir dar de alta (`POST`) nuevos registros en cualquiera de los 6 módulos [6].
*   **RF-07 (Modificación de Registros):** Permitir la edición usando `PUT` (reemplazo total) y/o `PATCH` (actualización parcial) según la API de DummyJSON para cada entidad [6].
*   **RF-08 (Eliminación de Registros):** Permitir borrar físicamente (`DELETE`) registros individuales en cada módulo [6].
*   **RF-09 (Feedback del Usuario):** Proporcionar mensajes visuales claros y oportunos al usuario final ante cualquier resultado (operación exitosa, error de red, credenciales incorrectas, etc.) [6].
*   **RF-10 (Navegación Intuitiva):** Permitir navegar de manera fluida entre los 6 módulos desde un menú principal o sidebar de administración [7].

### 3.2. Requerimientos No Funcionales (RNF) [7]
Se definen las siguientes restricciones tecnológicas y de calidad para el equipo **Malka** [7, 8, 9]:

*   **RNF-01 (Arquitectura Frontend):** Desarrollado exclusivamente en el frontend utilizando HTML5, CSS3 y JavaScript Vanilla [7].
*   **RNF-02 (Arquitectura de Carpetas):** Estructurar el código en directorios lógicos como `/services`, `/pages` y `/assets` [7].
*   **RNF-03 (Consumo Asíncrono):** Consumir servicios de forma asíncrona haciendo uso de `fetch` combinando `async/await` [8].
*   **RNF-04 (Diseño Responsivo):** Interfaz fluida, adaptable y usable tanto en pantallas de escritorio como en dispositivos móviles [8].
*   **RNF-05 (Tolerancia a Fallos):** Controlar los errores de red y de API mediante bloques `try/catch` para evitar bloqueos del sistema o caídas de la app [8].
*   **RNF-06 (Control de Versiones):** Uso obligatorio de Git, empleando un repositorio remoto, una estrategia estructurada de ramas y confirmaciones (commits) legibles y frecuentes de los 5 integrantes [1, 8].
*   **RNF-07 (Legibilidad y Buenas Prácticas):** Código autodocumentado con nombres semánticos, indentación consistente y comentarios claros [9].
*   **RNF-08 (Seguridad del Token):** No exponer credenciales de forma insegura en el código fuente; el token persistirá temporalmente en `localStorage` [4, 9].
*   **RNF-09 (Documentación):** Incluir un manual detallado de instalación, ejecución y arquitectura dentro del archivo `README.md` [9].

---

## 4. Flujo de Autenticación de JobConnect

El flujo de seguridad de la plataforma implementado por **Malka** sigue una arquitectura de token asimétrica de corta duración basada en el siguiente estándar de DummyJSON [4]:

```
+------------+               +------------------+               +------------------+
| Reclutador | ------------> | Login UI (Malka) | ------------> | API (/auth/login)|
|            |  Credenciales | (emilys / emilyspass)            | (DummyJSON)      |
+------------+               +------------------+               +------------------+
      ^                                                                  |
      |                                                                  | 200 OK
      |                                                                  v
+------------+               +------------------+               +------------------+
| Dashboard  | <------------ | Guardar Token    | <------------ | Retorna Token    |
| (Acceso OK)|   Redirección | (localStorage)   |   JSON payload| (JWT Token)      |
+------------+               +------------------+               +------------------+
```

### Proceso Paso a Paso:
1.  **Captura de Credenciales:** El usuario ingresa las credenciales de prueba en el formulario de login:
    *   **Usuario:** `emilys` [4]
    *   **Contraseña:** `emilyspass` [4]
2.  **Petición POST:** El frontend realiza una petición `POST` hacia `https://dummyjson.com/auth/login` enviando las credenciales en formato JSON dentro del cuerpo (`body`) y la cabecera `Content-Type: application/json`.
3.  **Respuesta y Persistencia:** Si la validación es correcta, la API retorna un objeto que contiene un token JWT [4]. El frontend de **Malka** extrae este token y lo almacena inmediatamente en `localStorage.setItem('jobconnect_token', token)` [4].
4.  **Consumo de Endpoints Protegidos:** Para consultar cualquier endpoint que requiera autenticación, el sistema recupera el token de `localStorage` y lo adjunta en los encabezados HTTP:
    ```javascript
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
    ```
5.  **Cierre de Sesión:** Cuando el reclutador hace clic en "Cerrar Sesión", se llama a `localStorage.removeItem('jobconnect_token')` y se redirige automáticamente al usuario al formulario de login [5, 6].

---

## 5. Resumen del Dominio del Negocio (Análisis Malka) [10]

Con el apoyo en investigación del dominio de Gemini Notebook, el equipo **Malka** ha sintetizado los siguientes conceptos técnicos y de negocio clave para el desarrollo [10]:

### A. La diferencia crítica entre PUT y PATCH
*   **`PUT` (Reemplazo Total):** Se utiliza cuando deseamos actualizar la entidad completa [6]. Si un candidato tiene 10 campos y enviamos un `PUT` con solo 2 campos, los otros 8 campos podrían eliminarse o quedar vacíos (según la base de datos). Reclama enviar la representación completa del objeto.
*   **`PATCH` (Actualización Parcial):** Se utiliza para modificar campos específicos [6]. Por ejemplo, si solo queremos cambiar el estado de una postulación de "Pendiente" a "Entrevistado", enviamos un `PATCH` únicamente con ese campo. Es mucho más ligero y eficiente para la red.

### B. El Ciclo de Vida de Empleabilidad en JobConnect
La plataforma replica el flujo de trabajo real de un reclutador:
1.  Se registra a un **Candidato** (`/users`) [3].
2.  Se publica una **Vacante** de trabajo (`/products`) [3].
3.  Una **Empresa cliente** (`/carts`) solicita cubrir un puesto [4].
4.  El candidato se registra en una **Postulación** (`/posts`) asociándose a la vacante [4].
5.  El reclutador evalúa y programa una **Entrevista** registrando notas (`/comments`) [4].
6.  Para coordinar todo el proceso, el reclutador gestiona sus **Tareas pendientes** (`/todos`) [4].

---

## 6. Arquitectura de Git y Estructura de Carpetas

### 6.1. Estructura de Carpetas del Proyecto (Monorrepo Frontend) [7]
```text
jobconnect-malka/
├── assets/                     # Estilos CSS, imágenes, logotipos y fuentes [7]
│   ├── css/
│   │   ├── styles.css
│   │   └── login.css
│   └── img/
├── src/
│   ├── pages/                  # Vistas principales de la aplicación [7]
│   │   ├── login.html
│   │   ├── dashboard.html
│   │   ├── candidatos.html
│   │   └── vacantes.html
│   └── services/               # Clientes API y peticiones fetch [7]
│       ├── apiService.js
│       ├── authService.js
│       └── moduloService.js
├── index.html                  # Punto de entrada de la aplicación
└── README.md                   # Documentación principal del sistema [9]
```

### 6.2. Estrategia de Ramas en Git [8, 11]
Dado que el equipo de **Malka** está compuesto por **5 integrantes**, adoptamos la estrategia **Git Flow Simplificada** para evitar conflictos en el código y asegurar entregas limpias [1, 11]:

*   `main`: Rama de producción. Solo contiene código estable y probado listo para entrega.
*   `develop`: Rama de integración donde se consolidan las características desarrolladas.
*   `feature/login-auth`: Implementación del inicio de sesión, guardado de token y protección de rutas.
*   `feature/candidates-jobs`: Desarrollo de los módulos de Candidatos y Vacantes.
*   `feature/companies-posts`: Desarrollo de los módulos de Empresas Clientes y Postulaciones.
*   `feature/interviews-todos`: Desarrollo de los módulos de Entrevistas y Tareas.
*   `feature/ui-ux-responsive`: Estilos CSS globales, responsive design y adaptabilidad.
