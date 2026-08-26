# Documento Reflexivo: El Rol de Gemini Notebook en el Ciclo de Vida de JobConnect (v2) [14]
**Desarrollado por: Malka (Equipo de 5 Integrantes)** [1]

Este informe detalla el análisis del equipo **Malka** sobre cómo la plataforma **Gemini Notebook (NotebookLM)** actuó como un copiloto de desarrollo e investigación para planificar, diseñar la arquitectura e implementar con éxito la base de datos basada en **Local JSON** para el proyecto **JobConnect** [1, 14].

---

## 1. Fase de Planificación (Día 1): De la API Externa a la Base de Datos Local JSON [10]

El reto inicial planteado por el enunciado consistía en consumir la API externa de DummyJSON [2, 3]. Sin embargo, al analizar con el asistente las limitantes de esta API (principalmente que las peticiones de escritura no persisten los datos en el servidor), el equipo identificó una oportunidad de mejora sustancial [9].

*   **Aporte de Gemini Notebook en el Cambio Arquitectónico:**
    *   **Diseño de la Base Local:** El asistente nos ayudó a conceptualizar una solución autónoma. En lugar de realizar peticiones estériles a DummyJSON, nos propuso utilizar archivos semilla JSON locales (`candidatos.json`, `vacantes.json`, etc.) y migrar la gestión dinámica a `localStorage` [3, 4, 7].
    *   **Simulación de REST:** Nos guió para mapear semánticamente los recursos originales del proyecto a archivos locales, estructurando una tabla de mapeo unificada donde mantuvimos las rutas operativas pero de manera local, garantizando el cumplimiento estricto del requerimiento RNF-01 (sistema únicamente frontend) [6, 7].
    *   **Planificación Git:** Apoyó el diseño de un flujo de trabajo para nuestro equipo de 5 personas, facilitando la creación de ramas independientes (como `feature/local-json-db`) que permitieron un desarrollo en paralelo y sin interferencias [1, 11].

---

## 2. Fase de Desarrollo (Día 2): El Desafío de la Asincronía y Persistencia de Escrituras [11]

El Día 2 nos enfrentó a un problema técnico de gran envergadura: cómo implementar un CRUD asíncrono con `fetch` cuando los servidores web locales impiden modificar archivos estáticos como `/src/data/candidatos.json` lanzando errores `405 Method Not Allowed` [7, 8].

*   **Aporte de Gemini Notebook en la Resolución Técnica:**
    *   **Estrategia de Inicialización (Data Seeding):** Nos ayudó a estructurar la lógica de `apiService.js`. El asistente sugirió usar `fetch` asíncrono solo para la primera lectura de los archivos JSON semilla [8]. Una vez cargada la semilla, los datos se vuelcan a `localStorage`, permitiendo que las operaciones de modificación (`POST`, `PUT`, `PATCH`, `DELETE`) alteren físicamente la información en formato JSON local [6, 8, 9].
    *   **Comprensión Práctica de PUT vs PATCH:** Al programar nuestro motor de base de datos local, consultamos al asistente cómo diferenciar el comportamiento de ambos métodos en la manipulación de objetos de JavaScript [6]. Nos instruyó a usar el reemplazo total de propiedades en el método `put`, mientras que para el `patch` nos facilitó la lógica del operador de propagación (`{ ...oldObject, ...patchData }`), garantizando una edición segura y parcial [6].
    *   **Simulación de Latencia:** Para simular las condiciones reales de una API en producción y asegurar el uso correcto de las estructuras `async/await` exigidas por el requerimiento RNF-03, el asistente propuso una función auxiliar `delay()` [8]. Esto nos permitió comprobar de manera fehaciente el correcto funcionamiento de los indicadores de carga ("spinners") en la interfaz de usuario.

---

## 3. Fase de Cierre y Entrega (Día 3): Documentación y Consolidación de Resultados [12]

El último día de desarrollo estuvo enfocado en garantizar una entrega impecable del código, preparar los soportes gráficos y organizar la presentación final [12, 13].

*   **Aporte de Gemini Notebook en la Redacción del README.md y Recursos:**
    *   **Documentación Detallada:** Tomando de base nuestra arquitectura de Base de Datos Local JSON, el asistente redactó un archivo `README.md` estructurado y sumamente legible (RNF-09) que detalla el sembrado de datos y las instrucciones para inicializar localmente el proyecto con Live Server [7, 9].
    *   **Eficiencia del Equipo:** El uso de Gemini Notebook como consultor de código y documentador redujo de manera drástica las horas de debate técnico e investigación en foros externos. El equipo Malka pudo enfocar su tiempo en pulir la responsividad de las interfaces en dispositivos móviles (RNF-04) y crear una experiencia de usuario limpia y profesional [8, 14].

---

## 4. Conclusión Reflexiva del Equipo Malka [1]

La adopción de Gemini Notebook como aliado de desarrollo permitió a **Malka** ir un paso más allá de lo exigido en el enunciado académico [14]. Al ayudarnos a concebir y estructurar una **Base de Datos Local JSON interactiva**, el asistente nos permitió entregar una aplicación JobConnect 100% funcional, autónoma y con persistencia real [2, 14]. La IA demostró ser un puente de valor incalculable entre los requerimientos conceptuales del negocio y los retos prácticos del código frontend moderno [14].
