# Requerimientos del sistema — JobConnect

## 1. Introducción

Este documento describe los requerimientos funcionales y no funcionales de la plataforma web JobConnect.

JobConnect es una aplicación frontend para la gestión de información relacionada con procesos de empleabilidad y reclutamiento. El sistema consume servicios de la API pública DummyJSON mediante Fetch API.

---

# 2. Requerimientos funcionales

Los requerimientos funcionales describen las acciones y funcionalidades que debe proporcionar el sistema.

| Código | Requerimiento                                                                                                                    |
| ------ | -------------------------------------------------------------------------------------------------------------------------------- |
| RF-01  | El sistema debe permitir a un usuario iniciar sesión con usuario y contraseña mediante el endpoint `/auth/login`.                |
| RF-02  | El sistema debe almacenar el token de sesión y utilizarlo en las peticiones que lo requieran mediante el header `Authorization`. |
| RF-03  | El sistema debe restringir el acceso a los módulos cuando el usuario no esté autenticado o no exista un token válido.            |
| RF-04  | El sistema debe permitir cerrar sesión eliminando el token almacenado.                                                           |
| RF-05  | El sistema debe permitir listar mediante GET los registros correspondientes a los seis módulos.                                  |
| RF-06  | El sistema debe permitir crear nuevos registros mediante POST en los módulos correspondientes.                                   |
| RF-07  | El sistema debe permitir editar registros mediante PUT y/o PATCH según corresponda.                                              |
| RF-08  | El sistema debe permitir eliminar registros mediante DELETE.                                                                     |
| RF-09  | El sistema debe mostrar mensajes de retroalimentación al usuario cuando una operación sea exitosa o falle.                       |
| RF-10  | El sistema debe permitir navegar entre los seis módulos mediante una interfaz principal.                                         |

---

# 3. Requerimientos no funcionales

Los requerimientos no funcionales describen las características de calidad, restricciones y condiciones técnicas del sistema.

| Código | Requerimiento                                                                                                                 |
| ------ | ----------------------------------------------------------------------------------------------------------------------------- |
| RNF-01 | El sistema debe ser únicamente frontend y desarrollarse con HTML, CSS y JavaScript.                                           |
| RNF-02 | El código debe estar organizado en carpetas con una estructura clara, por ejemplo `/services`, `/pages` y `/assets`.          |
| RNF-03 | El consumo de datos debe realizarse mediante Fetch API utilizando manejo asíncrono con `async/await`.                         |
| RNF-04 | La interfaz debe ser intuitiva, responsiva y usable en distintos tamaños de pantalla.                                         |
| RNF-05 | Los errores deben controlarse mediante `try/catch` para evitar que los fallos de red rompan la aplicación.                    |
| RNF-06 | El proyecto debe gestionarse mediante Git utilizando un repositorio remoto, ramas y commits descriptivos y frecuentes.        |
| RNF-07 | El código debe ser legible, utilizando nombres significativos, indentación consistente y comentarios cuando aporten claridad. |
| RNF-08 | Las credenciales y tokens no deben quedar expuestos de forma insegura dentro del código fuente.                               |
| RNF-09 | El proyecto debe incluir un archivo `README.md` con la documentación de instalación y uso.                                    |

---

# 4. Módulos y endpoints

| Módulo                | Recurso DummyJSON | Métodos                       |
| --------------------- | ----------------- | ----------------------------- |
| Candidatos            | `/users`          | GET, POST, PUT, PATCH, DELETE |
| Vacantes              | `/products`       | GET, POST, PUT, PATCH, DELETE |
| Empresas clientes     | `/carts`          | GET, POST, PUT, DELETE        |
| Postulaciones         | `/posts`          | GET, POST, PATCH, DELETE      |
| Entrevistas / notas   | `/comments`       | GET, POST, PATCH, DELETE      |
| Tareas del reclutador | `/todos`          | GET, POST, PATCH, DELETE      |

---

# 5. Autenticación

El sistema utiliza el endpoint:

```text
/auth/login
```

El token obtenido durante el inicio de sesión debe almacenarse en `localStorage`.

El acceso a los módulos debe estar restringido cuando no exista un token válido.

### Credenciales de prueba

```text
Usuario: emilys
Contraseña: emilyspass
```

---

# 6. Consumo de la API

La aplicación utiliza:

```text
https://dummyjson.com
```

Las peticiones se realizan mediante `fetch`.

Las operaciones CRUD utilizan los métodos HTTP correspondientes:

* GET → consultar información.
* POST → crear registros.
* PUT → reemplazar registros.
* PATCH → actualizar parcialmente.
* DELETE → eliminar registros.

---

# 7. Manejo de errores

Las operaciones asíncronas deben utilizar `try/catch` para controlar errores.

Cuando una petición no sea exitosa, la aplicación debe informar al usuario mediante un mensaje de retroalimentación.

Ejemplo:

```javascript
try {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Error en la petición");
    }

    const data = await response.json();

} catch (error) {
    console.error(error);
}
```

---

# 8. Control de versiones

El proyecto utiliza Git y GitHub como sistema de control de versiones.

Cada integrante trabaja mediante su propia rama para evitar modificar directamente la rama principal.

Ejemplo:

```text
main
├── Angel
└── Luis
```

Los cambios deben registrarse mediante commits descriptivos.

Ejemplo:

```bash
git add .
git commit -m "docs: actualizar documentación"
git push origin Luis
```

---

# 9. Documentación

El requerimiento RNF-09 establece que el proyecto debe incluir un archivo `README.md` con la documentación de instalación y uso.

El README del proyecto incluye:

* Descripción.
* Objetivo.
* Tecnologías.
* Requisitos previos.
* Instalación.
* Ejecución.
* Autenticación.
* Módulos.
* Métodos HTTP.
* Estructura.
* Manejo de errores.
* Control de versiones.
* Créditos.

---

# 10. Observación sobre db.json

Db.json simula las operaciones POST, PUT, PATCH y DELETE. Las respuestas de estas operaciones pueden ser exitosas, pero los cambios no se mantienen permanentemente en el servidor.

Por esta razón, la aplicación utiliza db.json principalmente como servicio de práctica para el consumo de APIs y la implementación de operaciones CRUD.
