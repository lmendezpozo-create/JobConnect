# JobConnect — Plataforma de Gestión de Empleabilidad 💼🚀
**Desarrollado con pasión por: Malka (Equipo de 5 Integrantes)** [1]

**JobConnect** es una aplicación web de administración (únicamente frontend) diseñada para digitalizar y centralizar el flujo de trabajo operativo de agencias de empleo y reclutamiento [2]. A través de una interfaz interactiva y adaptativa, la plataforma permite realizar operaciones completas de creación, lectura, actualización y eliminación (CRUD) para optimizar el control de talento, puestos y flujos evaluativos [2, 6, 8].

---

## 🛠️ Características Clave del Proyecto
*   **Seguridad y Autenticación:** Formulario de inicio de sesión completo acoplado al endpoint `/auth/login` con persistencia de sesión por Token JWT en `localStorage` [4, 5].
*   **6 Módulos de Operación Completa (CRUDs):** Interfaz unificada de administración para gestionar Candidatos, Vacantes, Empresas Clientes, Postulaciones, Entrevistas y Tareas [2, 3, 4].
*   **Consumo Moderno de APIs:** Arquitectura asíncrona robusta fundamentada en la API nativa de JavaScript `fetch` con el patrón `async/await` [8].
*   **Manejo de Errores Tolerante:** Implementación exhaustiva de bloques `try/catch` para capturar incidencias de red, evitando bloqueos inesperados y ofreciendo mensajes interactivos de feedback en UI [6, 8].
*   **Diseño UX/UI Responsivo:** Panel adaptado para dispositivos móviles, tabletas y pantallas de escritorio mediante CSS moderno [8].

---

## 📁 Estructura del Repositorio [7]
El proyecto de **Malka** sigue una arquitectura limpia de distribución por responsabilidades [7]:

```text
├── assets/                     # Estilos, logotipos e imágenes estáticas [7]
│   ├── css/
│   │   ├── styles.css          # Estilos globales de administración y sidebar
│   │   └── login.css           # Estilo del portal de acceso seguro
│   └── img/                    # Iconografía y recursos visuales
├── src/
│   ├── pages/                  # Vistas HTML individuales para cada módulo de negocio [7]
│   │   ├── login.html          # Interfaz de inicio de sesión seguro
│   │   ├── dashboard.html      # Panel principal con resúmenes estadísticos
│   │   ├── candidatos.html     # CRUD de Candidatos (/users de DummyJSON) [3]
│   │   ├── vacantes.html       # CRUD de Ofertas de Empleo (/products) [3]
│   │   ├── empresas.html       # CRUD de Empresas Clientes (/carts) [4]
│   │   ├── postulaciones.html  # CRUD de Seguimiento de Postulaciones (/posts) [4]
│   │   ├── entrevistas.html    # CRUD de Feedback y Notas (/comments) [4]
│   │   └── tareas.html         # CRUD de Planificación Diaria (/todos) [4]
│   └── services/               # Clientes API y lógica de peticiones asíncronas [7]
│       ├── apiService.js       # Cliente HTTP unificado con inyección automática de Token
│       ├── authService.js      # Control de login, logout y protección de vistas [5, 6]
│       └── moduloService.js    # Servicios individuales para cada uno de los 6 módulos
├── index.html                  # Enrutador principal de redirección automática
└── README.md                   # Documentación técnica que estás leyendo [9]
```

---

## 🔌 Mapeo de Módulos y Endpoints (DummyJSON API)
Todos los datos dinámicos son provistos y simulados mediante consumo de servicios REST de **DummyJSON** [3]:

| Módulo del Sistema | Endpoint en API | Métodos HTTP | Operación | Representación del Dominio |
|--------------------|-----------------|--------------|-----------|-----------------------------|
| **Candidatos** [3] | `/users` [3] | `GET`, `POST`, `PUT`, `PATCH`, `DELETE` [3] | CRUD Completo | Perfiles de talento postulante. |
| **Vacantes** [3] | `/products` [3] | `GET`, `POST`, `PUT`, `PATCH`, `DELETE` [3] | CRUD Completo | Ofertas laborales de empresas aliadas. |
| **Empresas** [4] | `/carts` [4] | `GET`, `POST`, `PUT`, `DELETE` [4] | CRUD Completo | Cuentas corporativas asociadas. |
| **Postulaciones** [4]| `/posts` [4] | `GET`, `POST`, `PATCH`, `DELETE` [4] | CRUD Completo | Relación Candidato-Vacante. |
| **Entrevistas** [4] | `/comments` [4] | `GET`, `POST`, `PATCH`, `DELETE` [4] | CRUD Completo | Feedback de entrevistas y notas evaluativas. |
| **Tareas** [4] | `/todos` [4] | `GET`, `POST`, `PATCH`, `DELETE` [4] | CRUD Completo | Control de pendientes del reclutador. |

*Nota:* Dado que DummyJSON es una API simulada de pruebas, no modificará permanentemente los servidores externos, por lo que **Malka** ha dotado a la aplicación de un controlador de estado en memoria para reflejar dinámicamente creaciones y eliminaciones al usuario durante su sesión [9].

---

## 🚀 Instalación y Despliegue Local

### Requisitos Previos
*   Un navegador web moderno (Google Chrome, Firefox, Microsoft Edge, etc.).
*   Un entorno de servidor local liviano. Se recomienda usar la extensión **Live Server** para Visual Studio Code o Python.

### Instrucciones de Configuración:
1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/tu-organizacion-malka/jobconnect-frontend.git
    cd jobconnect-frontend
    ```
2.  **Iniciar la aplicación:**
    *   *Opción VS Code:* Abre la carpeta raíz en tu editor, haz clic derecho sobre `index.html` y selecciona **Open with Live Server**.
    *   *Opción Python:* Ejecuta en tu terminal `python -m http.server 8000` y accede desde tu navegador web a `http://localhost:8000`.

---

## 🔑 Credenciales de Acceso Autorizado (Prueba)
El sistema requiere autenticación obligatoria para acceder a cualquier módulo [4, 5]. Utilice las credenciales por defecto configuradas en el servicio de autenticación de DummyJSON [4]:

*   **Usuario:** `emilys` [4]
*   **Contraseña:** `emilyspass` [4]

---

## 🤝 Estrategia de Trabajo Colaborativo (Malka Devs) [1, 11]
Como equipo de 5 desarrolladores, Malka empleó una estrategia robusta basada en Git:
1.  **Ramas de Funcionalidad (`feature/`):** Cada pareja o integrante trabajó en aislamiento sobre ramas específicas de desarrollo técnico para evitar conflictos y asegurar revisiones de código limpias antes de fusionar a `develop` [11].
2.  **Commits Descriptivos:** Empleo de prefijos semánticos para documentar el historial (ej: `feat: add candidate delete handler`, `fix: token injection header`) [8].
