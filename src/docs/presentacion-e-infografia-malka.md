# Guion del Video e Ideas de Diseño para la Infografía: JobConnect [12, 13]
**Desarrollado por: Malka (Equipo de 5 Integrantes)** [1]

Este entregable detalla las especificaciones de diseño y el guion para los entregables de **Cierre y Entrega (Día 3)** [12]: el video de presentación y la infografía arquitectónica de JobConnect [12, 13].

---

## 1. Guion Estructurado del Video de Presentación (Duración: ~5 Minutos) [12]

El video se divide equitativamente entre los **5 integrantes del equipo Malka** para asegurar la participación activa de todos [1].

### 🎬 Reparto de Roles de Malka:
*   **Presentador 1 (Introducción y Negocio):** Contexto del problema y descripción de JobConnect.
*   **Presentador 2 (Planificación y Git):** Requerimientos y estrategia de ramas.
*   **Presentador 3 (Flujo de Autenticación):** Demostración técnica del Login y seguridad del token.
*   **Presentador 4 (Demostración de los 6 CRUDs):** Funcionamiento de módulos, persistencia en memoria y API DummyJSON.
*   **Presentador 5 (Manejo de Errores y Conclusión):** Bloques `try/catch`, bitácora de dudas y conclusión reflexiva.

### ⏱️ Cronograma de Escenas:

#### **Escena 1: Introducción y Visión de Negocio (0:00 - 1:00)**
*   **Responsable:** Presentador 1
*   **Visual en pantalla:** Diapositiva con el logo de **Malka** y **JobConnect**, y luego la vista del Dashboard principal de la aplicación corriendo localmente.
*   **Guion hablado:**
    > "¡Hola a todos! Somos el equipo Malka y les presentamos JobConnect, un panel de administración web diseñado para simplificar la vida de las agencias de empleo. Nuestro sistema centraliza la administración de candidatos, vacantes, empresas clientes, postulaciones, entrevistas y tareas pendientes de reclutamiento en una interfaz responsiva, intuitiva y ágil. Para asegurar un entorno interactivo y dinámico, la plataforma consume de forma directa la API pública DummyJSON, garantizando un flujo estable en el frontend."

#### **Escena 2: Requerimientos y Flujo de Trabajo en Git (1:00 - 1:50)**
*   **Responsable:** Presentador 2
*   **Visual en pantalla:** Cuadro de requerimientos y captura del árbol de Git con las ramas de funcionalidad (`feature/*`).
*   **Guion hablado:**
    > "Para construir este sistema, en Malka seguimos un riguroso proceso de planificación. Estructuramos 10 requerimientos funcionales y 9 no funcionales, garantizando tolerancia a fallos y diseño adaptable. Además, al ser un grupo de 5 personas, aplicamos una estrategia de Git Flow Simplificada. Cada módulo del negocio se desarrolló de manera aislada en su propia rama `feature/` y se integró progresivamente en `develop` antes de la entrega final estable en `main`."

#### **Escena 3: Portal de Acceso y Seguridad de Sesión (1:50 - 2:40)**
*   **Responsable:** Presentador 3
*   **Visual en pantalla:** Vista del login en ejecución, ingreso del usuario `emilys` y contraseña `emilyspass`. Inspección de la consola del navegador mostrando el token en `localStorage`.
*   **Guion hablado:**
    > "La seguridad es clave. JobConnect restringe el acceso de forma absoluta si no hay un reclutador autenticado. Cuando ingresamos con las credenciales de prueba `emilys` y enviamos el formulario, nuestro servicio `authService` procesa el `POST` a DummyJSON y guarda de manera segura el Token JWT de respuesta en `localStorage`. A partir de este momento, cada petición de datos adjunta automáticamente el token en el encabezado `Authorization: Bearer <token>`, permitiendo el acceso y protegiendo las rutas privadas."

#### **Escena 4: Demostración Interactiva de CRUDs (2:40 - 4:00)**
*   **Responsable:** Presentador 4
*   **Visual en pantalla:** Grabación de pantalla navegando ágilmente por el menú lateral de JobConnect. Mostrando la creación de un nuevo Candidato (`POST`), el listado en la tabla (`GET`), la modificación con un botón (`PUT`/`PATCH`) y la eliminación exitosa (`DELETE`).
*   **Guion hablado:**
    > "La interfaz cuenta con 6 módulos administrativos completos mapeados a la API. Para superar la limitación de DummyJSON (que no persiste cambios en el backend real), el frontend de Malka implementa un estado en memoria. Así, cuando el reclutador elimina un candidato o crea una nueva vacante, la API procesa la simulación y nuestra lógica web actualiza el estado local de inmediato. Esto proporciona retroalimentación visual exitosa e instantánea para mantener la fluidez operativa."

#### **Escena 5: Tolerancia a Fallos, Bitácora y Cierre (4:00 - 5:00)**
*   **Responsable:** Presentador 5
*   **Visual en pantalla:** Demostración provocando un error (ej: apagar la red para ver el mensaje de retroalimentación de error con `try/catch`), vistas rápidas del README.md y conclusión del equipo.
*   **Guion hablado:**
    > "Por último, la robustez de JobConnect se logra con un manejo intensivo de excepciones mediante bloques `try/catch`. Si la red falla o las credenciales son incorrectas, la aplicación no se rompe; el sistema captura el error y alerta cordialmente al usuario. Gemini Notebook fue nuestro copiloto ideal en este viaje, ayudándonos a resolver dudas sobre CORS, persistencia simulada y estructuras asíncronas. ¡Gracias por su atención, esto es JobConnect por Malka!"

---

## 2. Ideas y Especificaciones para el Diseño de la Infografía [13]

La infografía debe crearse de manera altamente visual en una sola página utilizando herramientas como Canva, Figma o similar, estructurando la información técnica del sistema mediante bloques limpios [13]:

### 🎨 Paleta de Colores de Malka:
*   **Azul Índigo (#1E293B):** Color primario para fondos de bloques principales (Transmite profesionalismo y tecnología).
*   **Cian Eléctrico (#06B6D4):** Color de acento para representar flujos y conectores de API.
*   **Turquesa/Teal (#0D9488):** Para iconos de estados exitosos o botones activos.
*   **Blanco/Gris Claro (#F8FAFC):** Fondos de lectura limpios.

### 🧩 Secciones Clave de la Infografía:

1.  **Encabezado Principal:**
    *   **Título:** "Arquitectura JobConnect — Malka Dev Team" [1]
    *   **Subtítulo:** "Plataforma de Empleabilidad Frontend Consumiendo la API de DummyJSON" [2, 3]
2.  **Bloque de Seguridad (Flujo de Autenticación):**
    *   Gráfico simplificado que muestra al reclutador ingresando credenciales (`emilys` / `emilyspass`) [4].
    *   Icono de una llave o candado: Almacenamiento del Token JWT en `localStorage` [4].
    *   Icono de un sobre de petición: Envío de las cabeceras HTTP `Authorization: Bearer <token>` a la API [5].
3.  **Bloque Central - El Corazón de los 6 Módulos (Los CRUDs):**
    Una cuadrícula interactiva con 6 tarjetas, cada una con un icono representativo y su respectivo mapeo técnico [3, 4]:
    *   👤 **Candidatos:** `/users` ➔ `GET`, `POST`, `PUT`, `PATCH`, `DELETE` [3]
    *   💼 **Vacantes:** `/products` ➔ `GET`, `POST`, `PUT`, `PATCH`, `DELETE` [3]
    *   🏢 **Empresas Clientes:** `/carts` ➔ `GET`, `POST`, `PUT`, `DELETE` [4]
    *   📄 **Postulaciones:** `/posts` ➔ `GET`, `POST`, `PATCH`, `DELETE` [4]
    *   💬 **Entrevistas / Notas:** `/comments` ➔ `GET`, `POST`, `PATCH`, `DELETE` [4]
    *   ✅ **Tareas del Reclutador:** `/todos` ➔ `GET`, `POST`, `PATCH`, `DELETE` [4]
4.  **Bloque de Métodos HTTP (Diferencia Tecnológica):**
    *   Explicación visual de **`PUT`** (Círculo completo = Reemplazo Total) vs. **`PATCH`** (Círculo segmentado = Actualización Parcial) [6].
5.  **Pie de Infografía:**
    *   Resumen del dominio asíncrono (`fetch` + `async/await` + `try/catch`) [8].
    *   Sello de calidad: "Diseñado conceptualmente con el apoyo de Gemini Notebook" [13].
    *   Integrantes del Equipo **Malka** (5 Estudiantes) [1].
