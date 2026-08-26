# Guion del Video e Ideas de Diseño para la Infografía: JobConnect (Local JSON v2) [12, 13]
**Desarrollado por: Malka (Equipo de 5 Integrantes)** [1]

Este entregable detalla las especificaciones de diseño y el guion actualizado para los entregables de **Cierre y Entrega (Día 3)** del equipo **Malka** [12], adaptado 100% a la nueva **arquitectura de Base de Datos Local JSON con persistencia en localStorage** [6, 7].

---

## 1. Guion Estructurado del Video de Presentación (Duración: ~5 Minutos) [12]

El video se reparte de forma equitativa y colaborativa entre los **5 integrantes del equipo Malka** [1].

### 🎬 Reparto de Roles de Malka:
*   **Presentador 1 (Introducción e Innovación JSON):** Presentación del equipo, problema de negocio y por qué se migró a base de datos Local JSON.
*   **Presentador 2 (Planificación, Requerimientos y Git):** Requerimientos técnicos y estrategia de ramas del equipo de 5 personas.
*   **Presentador 3 (Portal de Login y Seguridad):** Demostración del Login asíncrono y autenticación contra `usuarios.json`.
*   **Presentador 4 (Demostración de CRUDs y Persistencia Real):** Recorrido por los módulos y demostración de que los cambios sí se guardan en `localStorage`.
*   **Presentador 5 (Tolerancia a Fallos y Conclusión Reflexiva):** Control con `try/catch` para fallas locales, bitácora y cierre del proyecto.

### ⏱️ Cronograma de Escenas Actualizado:

#### **Escena 1: Introducción y Visión de Negocio (0:00 - 1:00)**
*   **Responsable:** Presentador 1
*   **Visual en pantalla:** Logotipo de **Malka** y **JobConnect**, seguido del Dashboard principal de la aplicación corriendo localmente con métricas en tiempo real.
*   **Guion hablado:**
    > "¡Hola a todos! Somos el equipo Malka y hoy les presentamos JobConnect, un panel web de administración para digitalizar agencias de reclutamiento. Nuestra plataforma gestiona candidatos, vacantes, empresas, postulaciones, entrevistas y tareas. Originalmente, el enunciado recomendaba usar DummyJSON; sin embargo, al notar que las operaciones de DummyJSON son ficticias y no persisten los datos, en Malka decidimos ir un paso adelante: creamos una **arquitectura de Base de Datos Local basada en archivos JSON semilla y persistencia real en localStorage**. Esto garantiza que el sistema funcione 100% offline, con total velocidad y guardando de forma real toda la información en el navegador."

#### **Escena 2: Planificación y Colaboración en Git (1:00 - 1:50)**
*   **Responsable:** Presentador 2
*   **Visual en pantalla:** Gráfico de requerimientos técnicos (RF/RNF) y el árbol de Git mostrando las confirmaciones frecuentes y ramas de funcionalidad del equipo de 5 personas.
*   **Guion hablado:**
    > "Para materializar este diseño, planificamos minuciosamente 10 requerimientos funcionales y 9 no funcionales, priorizando el uso de estándares semánticos en HTML, CSS y JS Vanilla. Al ser un equipo de 5 integrantes, la coordinación fue clave. Establecimos un flujo de Git ordenado usando ramas `feature/` por parejas de trabajo (como `feature/local-json-db` y `feature/candidates-jobs-crud`), logrando integrar nuestro código en la rama `develop` de manera limpia, ordenada y libre de conflictos."

#### **Escena 3: Acceso Seguro y Validación asíncrona de Sesión (1:50 - 2:40)**
*   **Responsable:** Presentador 3
*   **Visual en pantalla:** Vista del login. El presentador introduce el usuario `emilys` y la contraseña `emilyspass`. Tras presionar 'Ingresar', abre las Herramientas de Desarrollador de Chrome mostrando el token temporal creado y guardado en la pestaña 'Application' de `localStorage`.
*   **Guion hablado:**
    > "La seguridad está perfectamente resguardada en JobConnect. Cuando el reclutador intenta acceder, nuestro script inline comprueba de inmediato la existencia de una sesión; si no hay token, bloquea el acceso de inmediato redirigiendo a `login.html`. Al loguearse, nuestro `authService` realiza un `fetch` asíncrono para leer el archivo local `usuarios.json`, valida las credenciales y genera un token seguro en `localStorage`. Este token es inyectado por nuestro cliente asíncrono en cada consulta posterior simulando un encabezado de autorización seguro."

#### **Escena 4: Demostración de los 6 CRUDs con Persistencia Real (2:40 - 4:00)**
*   **Responsable:** Presentador 4
*   **Visual en pantalla:** Navegación por la app. Se crea un Candidato (`POST`), se lista en la tabla (`GET`), se edita mediante un modal (`PUT`/`PATCH`) y se elimina uno viejo (`DELETE`). Para probar la persistencia real, el presentador **recarga el navegador**, y los datos nuevos siguen presentes en la tabla.
*   **Guion hablado:**
    > "¡Y aquí está la magia de la arquitectura diseñada por Malka! Disponemos de 6 CRUDs completos que interactúan de forma asíncrona con el motor `apiService`. En el primer arranque, el sistema siembra los datos iniciales desde los archivos locales JSON. A partir de allí, cualquier creación, reemplazo total con `PUT` o actualización parcial de campos con `PATCH` se almacena dinámicamente en el JSON de `localStorage`. Como pueden observar, acabo de registrar un candidato y cambiar el estado de una postulación, y al recargar la página la información sigue aquí intacta. Esto da una experiencia de usuario sumamente profesional y fluida."

#### **Escena 5: Tolerancia a Fallos, Soporte IA y Cierre (4:00 - 5:00)**
*   **Responsable:** Presentador 5
*   **Visual en pantalla:** Simulación de un error de carga intencional para mostrar cómo se alerta de forma amigable al usuario con `try/catch`. Toma rápida de los archivos JSON semilla y el manual README.md.
*   **Guion hablado:**
    > "La confiabilidad de la aplicación es primordial, por ello todos nuestros procesos de parsing y consumo asíncrono están protegidos por estructuras `try/catch`, evitando caídas del sistema y alertando al reclutador de manera asertiva. Durante el Día 2 de codificación, Gemini Notebook fue un soporte invaluable, ayudándonos a solventar problemas con las cabeceras, rediseñar el enrutador de protección del login y estructurar la lógica del `PATCH` local. Con esta base de datos local JSON, el equipo Malka entrega un proyecto robusto, rápido y listo para producción. ¡Muchas gracias por su atención!"

---

## 2. Ideas y Especificaciones para el Diseño de la Infografía [13]

La infografía de Malka representa de manera esquemática la arquitectura autónoma del sistema [13].

### 🎨 Paleta de Colores Corporativa (Malka):
*   **Azul Índigo Oscuro (#0F172A):** Fondo general elegante y profesional.
*   **Cian Neón (#06B6D4):** Líneas de flujo y conectores de lectura asíncrona.
*   **Esmeralda Brillante (#10B981):** Para representar operaciones de escritura persistente (`POST`, `PUT`, `PATCH`, `DELETE`) en la base local.
*   **Blanco / Platino (#F1F5F9):** Texto y contenedores de datos.

### 🧩 Diagramación en 5 Secciones Clave:

1.  **Banner de Identidad:**
    *   **Título:** \"Arquitectura JobConnect — Malka Dev Team\" [1]
    *   **Subtítulo:** \"Ecosistema de Empleabilidad Frontend Autónomo con Base de Datos Local JSON\" [2]
2.  **Infografía del Motor de Datos (Novedad Arquitectónica):**
    *   Un gráfico de flujo dividido en tres niveles:
        *   *Nivel 1: Archivos Semilla (.json)* ➔ Representados como disquetes u hojas de datos estáticas en el disco del repositorio.
        *   *Nivel 2: apiService de Malka* ➔ Un engranaje que realiza un único `fetch` inicial con `async/await` [8].
        *   *Nivel 3: Base de Datos localStorage* ➔ Representado como un cilindro de base de datos local que asimila las lecturas y escribe físicamente los cambios en formato JSON dinámico.
3.  **Flujo Secuencial de Acceso (Login Seguro):**
    *   *Paso 1:* Formulario de Login ➔ *Paso 2:* Fetch asíncrono a `/src/data/usuarios.json` [4, 5] ➔ *Paso 3:* Token seguro inyectado en `localStorage` [4] ➔ *Paso 4:* Apertura de rutas protegidas y bloqueo automático si no hay sesión [5].
4.  **Matriz Operativa de Módulos (Los 6 CRUDs):**
    Representación visual con iconos de cada entidad, su fuente de datos y métodos soportados [3, 4]:
    *   👤 **Candidatos:** `candidatos.json` ➔ CRUD Completo (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) [3].
    *   💼 **Vacantes:** `vacantes.json` ➔ CRUD Completo (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) [3].
    *   🏢 **Empresas:** `empresas.json` ➔ CRUD Completo (`GET`, `POST`, `PUT`, `DELETE`) [4].
    *   📄 **Postulaciones:** `postulaciones.json` ➔ CRUD Completo (`GET`, `POST`, `PATCH`, `DELETE`) [4].
    *   💬 **Entrevistas:** `entrevistas.json` ➔ CRUD Completo (`GET`, `POST`, `PATCH`, `DELETE`) [4].
    *   ✅ **Tareas:** `tareas.json` ➔ CRUD Completo (`GET`, `POST`, `PATCH`, `DELETE`) [4].
5.  **Diferenciación Técnica de Métodos de Escritura:**
    *   **`PUT`:** Icono de "Reemplazo Completo" (Sobrescribe todo el registro en `localStorage` coincidiendo con el ID) [6].
    *   **`PATCH`:** Icono de "Mezcla de Atributos" (Mezcla de datos conservando las propiedades adyacentes del JSON) [6].
6.  **Pie de Página Académico:**
    *   \"Diseñado conceptualmente con el apoyo de Gemini Notebook para el proyecto JobConnect\" [13].
    *   Firmado por los **5 integrantes de Malka** [1].
