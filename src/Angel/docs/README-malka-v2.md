# JobConnect — Plataforma de Gestión de Empleabilidad (Local JSON v2) 💼🚀
**Desarrollado con orgullo por: Malka (Equipo de 5 Integrantes)** [1]

**JobConnect** es una sofisticada solución de software frontend concebida para agilizar, digitalizar y centralizar los flujos operativos de agencias de empleo y selección [2]. Desarrollada exclusivamente con tecnologías web nativas, la aplicación provee un entorno intuitivo y responsivo para administrar de manera persistente las seis entidades nucleares del ecosistema de empleabilidad [2, 6, 8].

---

## 🛠️ Evolución de Arquitectura: Base de Datos Local JSON
Originalmente estructurado para interactuar con la API pública de DummyJSON [3], el equipo **Malka** ha rediseñado la plataforma hacia un modelo de **Base de Datos Local basada en JSON (Local JSON Database)** con motor de sincronización asíncrona y almacenamiento persistente en **`localStorage`** [6, 7, 9].

### Beneficios clave de esta arquitectura sobre la API DummyJSON:
1.  **Persistencia Real y Fiable:** A diferencia de DummyJSON (donde creaciones, ediciones o eliminaciones se simulan y se borran inmediatamente) [9], **JobConnect v2** almacena de manera física y persistente cualquier cambio localmente en el navegador. Las modificaciones persisten incluso tras recargar la página o apagar la máquina [6, 9].
2.  **Funcionamiento 100% Fuera de Línea (Offline):** La aplicación no depende de servidores externos o conexiones a internet inestables, cargándose localmente con total velocidad y confiabilidad.
3.  **Sembrado Inicial Automático (Data Seeding):** La base de datos local se inicializa de forma automatizada en el primer acceso del usuario a partir de archivos JSON limpios configurados de forma nativa en el repositorio.

---

## 📁 Estructura del Repositorio [7]
El proyecto sigue una estricta distribución de responsabilidades modular [7]:

```text
├── assets/                     # Recursos visuales y estilos estáticos [7]
│   ├── css/
│   │   ├── styles.css          # Estilos globales de administración y sidebar responsivo
│   │   └── login.css           # Hoja de estilos del portal de inicio de sesión seguro
│   └── img/                    # Logotipos, iconografía y avatares por defecto
├── src/
│   ├── data/                   # Base de Datos Semilla (Archivos de Origen JSON)
│   │   ├── usuarios.json       # Credenciales del personal de reclutamiento [3]
│   │   ├── candidatos.json     # Registro inicial de talento postulante [3]
│   │   ├── vacantes.json       # Listado semilla de puestos abiertos [3]
│   │   ├── empresas.json       # Empresas clientes corporativas [4]
│   │   ├── postulaciones.json  # Bitácora de postulaciones [4]
│   │   ├── entrevistas.json    # Histórico de evaluaciones y notas [4]
│   │   └── tareas.json         # Tareas operativas diarias del reclutador [4]
│   ├── pages/                  # Estructura de vistas HTML (Módulos de negocio) [7]
│   │   ├── login.html          # Portal de inicio de sesión seguro
│   │   ├── dashboard.html      # Panel con estadísticas métricas globales
│   │   ├── candidatos.html     # CRUD de Candidatos
│   │   ├── vacantes.html       # CRUD de Vacantes de Empleo
│   │   ├── empresas.html       # CRUD de Empresas Clientes
│   │   ├── postulaciones.html  # CRUD de Control de Postulaciones
│   │   ├── entrevistas.html    # CRUD de Notas de Evaluaciones
│   │   └── tareas.html         # CRUD de Planificación Operativa Diaria (To-Do)
│   └── services/               # Lógica del cliente API y enrutador local [7]
│       ├── apiService.js       # CRUD Engine con sincronización localStorage
│       ├── authService.js      # Validación local de accesos y control de tokens [5, 6]
│       └── moduloService.js    # Servicios de manipulación de datos específicos de negocio
├── index.html                  # Indexador y enrutador de acceso inicial
└── README.md                   # Documentación técnica que estás leyendo [9]
```

---

## 📊 Matriz de Entidades de Negocio y Persistencia JSON
Los datos son administrados a través de las siguientes entidades del dominio mapeadas a archivos JSON locales:

| Módulo del Sistema | Seed JSON Local | Métodos Soportados | Estado de Persistencia | Representación del Negocio |
|--------------------|-----------------|--------------------|------------------------|-----------------------------|
| **Candidatos** [3] | `candidatos.json` | `GET`, `POST`, `PUT`, `PATCH`, `DELETE` [3] | Persistente (Local) | Perfiles curriculares del talento postulante [3]. |
| **Vacantes** [3] | `vacantes.json` | `GET`, `POST`, `PUT`, `PATCH`, `DELETE` [3] | Persistente (Local) | Especificaciones técnicas y ofertas de puestos [3]. |
| **Empresas** [4] | `empresas.json` | `GET`, `POST`, `PUT`, `DELETE` [4] | Persistente (Local) | Entidades corporativas contratantes [4]. |
| **Postulaciones** [4]| `postulaciones.json`| `GET`, `POST`, `PATCH`, `DELETE` [4] | Persistente (Local) | Asociación activa y estatus de Candidato-Vacante [4]. |
| **Entrevistas** [4] | `entrevistas.json` | `GET`, `POST`, `PATCH`, `DELETE` [4] | Persistente (Local) | Notas cualitativas y feedback del reclutador [4]. |
| **Tareas** [4] | `tareas.json` | `GET`, `POST`, `PATCH`, `DELETE` [4] | Persistente (Local) | Agenda de quehaceres operativos del reclutador [4]. |

---

## 🔑 Credenciales de Acceso Autorizado (Prueba)
La plataforma se encuentra estrictamente protegida [5]. Las credenciales válidas están configuradas en la base JSON semilla `/src/data/usuarios.json` [4]:

*   **Usuario:** `emilys` [4]
*   **Contraseña:** `emilyspass` [4]

---

## 🚀 Instalación y Despliegue Local en 3 Pasos

### Requisitos Previos
*   Un navegador de última generación.
*   Un servidor local estático. Se recomienda la extensión **Live Server** para Visual Studio Code.

### Pasos para Ejecutar:
1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/tu-organizacion-malka/jobconnect-frontend.git
    cd jobconnect-frontend
    ```
2.  **Lanzar el Servidor Local:**
    *   *Desde VS Code:* Haz clic derecho sobre `index.html` y selecciona **Open with Live Server**.
    *   *Desde Terminal:* Ejecuta `python -m http.server 8000` (o `npx http-server` si utilizas NodeJS) y accede en tu navegador a `http://localhost:8000`.
3.  **Iniciar sesión:** Usa las credenciales `emilys` / `emilyspass` para acceder a la base local unificada [4].

---

## 🤝 Estrategia de Trabajo Colaborativo (Malka Devs) [1, 11]
Como equipo integrado por 5 desarrolladores, el proyecto se coordinó bajo Git aplicando la metodología **Git Flow Simplificada** [11]:
*   **`main` / `develop`:** Ramas de protección para asegurar integraciones estables sin regresiones en las entregas del mini proyecto.
*   **Ramas de Característica (`feature/`)**: Cada desarrollador codificó módulos aislados, asegurando que los estilos de interfaz responsiva (RNF-04) y el manejo asíncrono con `async/await` funcionaran de manera uniforme antes de realizar la fusión final [7, 8].
