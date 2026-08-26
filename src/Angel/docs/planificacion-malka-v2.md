# Documento de Planificación: Proyecto JobConnect (Local JSON v2)
**Desarrollado por: Malka (Equipo de 5 Integrantes)** [1]

Este documento constituye la versión actualizada de la **Fase de Planificación (Día 1)** para el desarrollo de la plataforma de empleabilidad **JobConnect**, diseñada e implementada por la agencia de desarrollo **Malka** [1, 11]. 

*Nota de evolución arquitectónica:* En esta versión, el equipo **Malka** ha tomado la decisión estratégica de migrar el consumo desde la API externa DummyJSON hacia una **Arquitectura de Base de Datos Local basada en JSON (Local JSON Database con persistencia en localStorage)** [2, 9]. Esta decisión optimiza el rendimiento del sistema, asegura un funcionamiento 100% offline y permite que todas las operaciones de escritura (creaciones, ediciones y eliminaciones) **persistan de forma real** durante y entre las sesiones del usuario, superando la limitación de DummyJSON donde los datos no se guardaban en el servidor [9].

---

## 1. Descripción del Sistema
**JobConnect** es un panel de administración web interactivo (desarrollado exclusivamente en el frontend) diseñado para digitalizar y optimizar la gestión operativa de una empresa de empleabilidad [2]. El sistema centraliza el control de seis entidades clave del negocio: candidatos, vacantes, empresas clientes, postulaciones, entrevistas y tareas de reclutadores [2].

Para garantizar la autonomía, estabilidad y persistencia real de los datos sin requerir una base de datos en un servidor backend de producción, **Malka** implementó una solución basada en **archivos JSON locales** como semillas de datos iniciales y el motor del navegador **localStorage** para emular la persistencia relacional en formato JSON [6, 7, 9]. Esta estructura simula a la perfección el comportamiento de un backend REST tradicional, pero de forma autónoma en el cliente, respetando la restricción de que el sistema sea puramente frontend [6, 7].

---

## 2. Tabla de Módulos y Localización de Datos
A continuación, se detalla el mapeo de los recursos locales JSON a las entidades del dominio de empleabilidad de **JobConnect** junto con los métodos HTTP y operaciones que implementará el equipo **Malka** [3, 4]:

| # | Módulo del Negocio | Fuente Semilla JSON Local | Métodos / Operaciones Implementadas | Descripción Funcional |
|---|--------------------|---------------------------|-------------------------------------|-----------------------|
| **1** | **Candidatos** [3] | `/src/data/candidatos.json` | `GET` (Carga) · `POST` (Creación) · `PUT` (Reemplazo) · `PATCH` (Edición parcial) · `DELETE` (Eliminación) [3] | Gestión de perfiles profesionales de los postulantes con almacenamiento persistente local. |
| **2** | **Vacantes** [3] | `/src/data/vacantes.json` | `GET` · `POST` · `PUT` · `PATCH` · `DELETE` [3] | Catálogo de ofertas de trabajo y especificaciones técnicas. |
| **3** | **Empresas clientes** [4] | `/src/data/empresas.json` | `GET` · `POST` · `PUT` · `DELETE` [4] | Control de cuentas corporativas y solicitudes de reclutamiento. |
| **4** | **Postulaciones** [4] | `/src/data/postulaciones.json` | `GET` · `POST` · `PATCH` · `DELETE` [4] | Seguimiento de la postulación de un candidato a una vacante. |
| **5** | **Entrevistas / notas** [4] | `/src/data/entrevistas.json` | `GET` · `POST` · `PATCH` · `DELETE` [4] | Registro del feedback del reclutador y notas de entrevistas. |
| **6** | **Tareas del reclutador** [4] | `/src/data/tareas.json` | `GET` · `POST` · `PATCH` · `DELETE` [4] | Lista de tareas pendientes diarias del reclutador (To-Do). |

---

## 3. Requerimientos del Sistema (Adaptados a Local JSON)

### 3.1. Requerimientos Funcionales (RF) [5]
El sistema de JobConnect cumple estrictamente con los siguientes requisitos del negocio [5, 6, 7]:

*   **RF-01 (Autenticación):** El sistema debe permitir a un usuario iniciar sesión con usuario y contraseña contra un servicio de validación que consume la semilla local `/src/data/usuarios.json` [5].
*   **RF-02 (Token en cabeceras):** Almacenar el token de sesión generado y simular su envío y verificación en las peticiones que lo requieran mediante el encabezado `Authorization: Bearer <token>` [5].
*   **RF-03 (Protección de Rutas):** Restringir el acceso a las vistas de los módulos si el usuario no cuenta con un token de sesión activo [5].
*   **RF-04 (Cierre de Sesión):** Permitir la desautenticación de forma segura eliminando el token de `localStorage` [6].
*   **RF-05 (Lectura de Módulos):** Listar (`GET`) en pantalla los registros existentes de cada uno de los 6 módulos cargados desde la base de datos JSON local [6].
*   **RF-06 (Creación de Registros):** Permitir dar de alta (`POST`) nuevos registros e insertarlos dinámicamente en el almacenamiento JSON de `localStorage` para que persistan [6].
*   **RF-07 (Modificación de Registros):** Permitir la edición usando reemplazo total (`PUT`) o actualización parcial (`PATCH`) modificando directamente el objeto JSON correspondiente en el cliente [6].
*   **RF-08 (Eliminación de Registros):** Permitir borrar físicamente (`DELETE`) registros individuales del JSON almacenado [6].
*   **RF-09 (Feedback del Usuario):** Proporcionar mensajes visuales interactivos (alertas, modales de éxito o banners de error) ante cualquier resultado de las operaciones [6].
*   **RF-10 (Navegación Intuitiva):** Permitir navegar de manera fluida entre los 6 módulos desde un menú principal o sidebar de administración [7].

### 3.2. Requerimientos No Funcionales (RNF) [7]
Se definen las siguientes restricciones tecnológicas y de calidad para el equipo **Malka** [7, 8, 9]:

*   **RNF-01 (Arquitectura Frontend):** Desarrollado exclusivamente en el frontend utilizando HTML5, CSS3 y JavaScript Vanilla sin dependencias de frameworks pesados [7].
*   **RNF-02 (Arquitectura de Carpetas):** Estructurar el código en directorios lógicos e incluir una carpeta `/data` para las fuentes semilla JSON [7].
*   **RNF-03 (Consumo Asíncrono):** Consumir la base de datos JSON local de forma asíncrona haciendo uso de `fetch` combinando `async/await` para emular el retardo de red [8].
*   **RNF-04 (Diseño Responsivo):** Interfaz fluida, adaptable y usable tanto en pantallas de escritorio como en dispositivos móviles [8].
*   **RNF-05 (Tolerancia a Fallos):** Controlar los errores de parsing JSON, fallos de lectura de archivos locales y excepciones de almacenamiento mediante bloques `try/catch` [8].
*   **RNF-06 (Control de Versiones):** Uso de Git, empleando un repositorio remoto con la estrategia simplificada de ramas y confirmaciones claras de los 5 integrantes [1, 8].
*   **RNF-07 (Legibilidad y Buenas Prácticas):** Código limpio con nombres semánticos, indentación consistente y comentarios claros [9].
*   **RNF-08 (Seguridad del Token):** Almacenar de forma segura el token en `localStorage` impidiendo accesos maliciosos [4, 9].
*   **RNF-09 (Documentación):** Incluir un manual detallado de instalación, ejecución y arquitectura dentro del archivo `README.md` [9].

---

## 4. Flujo de Autenticación Local con JSON y Tokens

El flujo de seguridad de la plataforma implementado por **Malka** emula de manera exacta el flujo JWT tradicional pero de forma local para mantener la autonomía del frontend [4]:

```
+------------+               +------------------+               +-----------------------+
| Reclutador | ------------> | Login UI (Malka) | ------------> | authService           |
|            |  Credenciales | (emilys / emilyspass)            | (Valida vs usuarios.json)
+------------+               +------------------+               +-----------------------+
      ^                                                                     |
      |                                                                     | Genera Token Ficticio
      |                                                                     v
+------------+               +------------------+               +-----------------------+
| Dashboard  | <------------ | Guardar Token    | <------------ | Retorna Token y User  |
| (Acceso OK)|   Redirección | (localStorage)   |   JSON payload| (JWT Local)           |
+------------+               +------------------+               +-----------------------+
```

### Proceso Paso a Paso:
1.  **Captura de Credenciales:** El usuario ingresa las credenciales de prueba en el formulario de login:
    *   **Usuario:** `emilys` [4]
    *   **Contraseña:** `emilyspass` [4]
2.  **Petición Fetch:** El frontend realiza una petición asíncrona `fetch` hacia `/src/data/usuarios.json` para obtener el listado de usuarios permitidos.
3.  **Validación y Generación de Token:** El servicio busca el usuario ingresado. Si coincide la contraseña, genera un token ficticio firmado localmente (por ejemplo, una cadena Base64 autogenerada que simula un JWT).
4.  **Persistencia:** El frontend de **Malka** guarda este token y los datos básicos del usuario en `localStorage` (`localStorage.setItem('jobconnect_token', token)`) [4].
5.  **Validación de Sesión:** Cada página del sistema comprueba la existencia de este token en `localStorage` al cargarse. Si no existe, bloquea la vista y redirige al login [5].
6.  **Cierre de Sesión:** Al hacer clic en \"Cerrar Sesión\", se ejecuta un borrado completo de las claves del proyecto de `localStorage` y se realiza la redirección a `login.html` [5, 6].

---

## 5. Resumen del Dominio del Negocio (Análisis Malka) [10]

Con el apoyo de Gemini Notebook, el equipo **Malka** estructuró el ciclo del negocio de la siguiente manera, utilizando JSON local para asegurar la persistencia real de cada flujo [10]:

### A. La diferencia crítica entre PUT y PATCH en un entorno Local JSON
*   **`PUT` (Reemplazo Total):** Cuando el reclutador edita los datos de un Candidato (`/src/data/candidatos.json`), se envía el objeto completo editado [6]. En nuestra base de datos local JSON, buscamos el ID del registro y lo sobrescribimos por completo con el nuevo payload.
*   **`PATCH` (Actualización Parcial):** Cuando solo necesitamos modificar un campo específico (como marcar una tarea como completada en `/src/data/tareas.json` o modificar las notas de una entrevista) [4], el frontend envía únicamente la propiedad que cambió. Nuestro servicio asíncrono busca el elemento por ID y mezcla el objeto antiguo con el nuevo campo utilizando un "spread operator" (`{ ...oldObject, ...patchData }`), optimizando la memoria y previniendo la pérdida de datos circundantes [6].

### B. El Ciclo de Vida de Empleabilidad de JobConnect
La plataforma replica el flujo de reclutamiento completo:
1.  **Candidatos:** El talento inicial ingresa a la base JSON local [3].
2.  **Vacantes:** Se estructuran los puestos laborales que requieren cubrirse [3].
3.  **Empresas clientes:** Organizaciones aliadas que solicitan procesos de búsqueda [4].
4.  **Postulaciones:** Vinculación directa entre un Candidato y una Vacante [4].
5.  **Entrevistas / notas:** Evaluaciones cualitativas y notas técnicas generadas en las reuniones [4].
6.  **Tareas del reclutador:** Planificación diaria de entrevistas, llamadas y revisiones del reclutador [4].

---

## 6. Arquitectura de Git y Estructura de Carpetas (Local JSON)

### 6.1. Estructura de Carpetas del Proyecto [7]
```text
jobconnect-malka/
├── assets/                     # Estilos CSS, imágenes y recursos estáticos [7]
│   ├── css/
│   │   ├── styles.css
│   │   └── login.css
│   └── img/
├── src/
│   ├── data/                   # Semillas de bases de datos locales JSON (Novedad v2)
│   │   ├── usuarios.json       # Credenciales del personal de reclutamiento [3]
│   │   ├── candidatos.json     # Semilla de postulantes [3]
│   │   ├── vacantes.json       # Semilla de puestos [3]
│   │   ├── empresas.json       # Semilla de empresas aliadas [4]
│   │   ├── postulaciones.json  # Semilla de postulaciones [4]
│   │   ├── entrevistas.json    # Semilla de notas de entrevistas [4]
│   │   └── tareas.json         # Semilla de tareas diarias [4]
│   ├── pages/                  # Vistas principales de la aplicación [7]
│   │   ├── login.html
│   │   ├── dashboard.html
│   │   ├── candidatos.html
│   │   └── vacantes.html
│   └── services/               # Clientes API y persistencia JSON local [7]
│       ├── apiService.js       # Simula consumo asíncrono y CRUDs en localStorage
│       ├── authService.js      # Validación local de usuarios y sesiones [5, 6]
│       └── moduloService.js    # Servicios específicos de negocio
├── index.html                  # Enrutador principal
└── README.md                   # Documentación principal del sistema [9]
```

### 6.2. Estrategia de Ramas en Git [8, 11]
El equipo de 5 integrantes de **Malka** mantiene las siguientes ramas de desarrollo activo para aislar características de forma ordenada [1, 11]:
*   `main`: Producción estable.
*   `develop`: Integración de código.
*   `feature/local-json-db`: Creación de archivos JSON semilla, inyección e inicialización en `localStorage`.
*   `feature/login-auth-local`: Autenticación contra `usuarios.json` y protección de rutas.
*   `feature/candidates-jobs-crud`: Implementación de Candidatos y Vacantes consumiendo el API local.
*   `feature/companies-posts-crud`: Implementación de Empresas y Postulaciones.
*   `feature/interviews-todos-crud`: Implementación de Entrevistas y Tareas.
*   `feature/ui-ux-responsive`: Estilos y responsividad para móviles y ordenadores.
