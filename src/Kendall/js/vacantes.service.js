/**
 * Servicio de Vacantes.
 *
 * Único responsable de comunicarse con JSON Server para el recurso
 * "vacantes". Ningún componente o página debe hacer fetch() directamente:
 * siempre deben pasar por las funciones de este archivo.
 *
 * Recurso: http://localhost:3000/vacantes
 */

const API_BASE = 'http://localhost:3000';
const RECURSO = 'vacantes';
const API_URL = `${API_BASE}/${RECURSO}`;

/**
 * Error personalizado para distinguir fallos de conexión de errores
 * de negocio (ej. respuesta 404) en las pantallas que consumen el servicio.
 */
export class ApiError extends Error {
  constructor(mensaje, { tipo = 'servidor', status = null } = {}) {
    super(mensaje);
    this.name = 'ApiError';
    this.tipo = tipo; // 'conexion' | 'servidor' | 'validacion'
    this.status = status;
  }
}

/**
 * Envuelve fetch() con manejo homogéneo de errores de red y de HTTP.
 * @param {string} url
 * @param {RequestInit} opciones
 */
async function solicitar(url, opciones = {}) {
  let respuesta;

  try {
    respuesta = await fetch(url, opciones);
  } catch (error) {
    // Falla de red: JSON Server apagado, CORS, sin conexión, etc.
    throw new ApiError(
      'No se pudo conectar con el servidor. Verifica que JSON Server esté ejecutándose.',
      { tipo: 'conexion' }
    );
  }

  if (!respuesta.ok) {
    throw new ApiError(
      `La solicitud falló con estado ${respuesta.status}.`,
      { tipo: 'servidor', status: respuesta.status }
    );
  }

  // DELETE normalmente responde sin cuerpo.
  if (respuesta.status === 204) {
    return null;
  }

  try {
    return await respuesta.json();
  } catch (error) {
    return null;
  }
}

/**
 * Obtiene todas las vacantes, con soporte opcional de búsqueda y filtros
 * usando los parámetros de consulta que entiende JSON Server.
 * @param {{ q?: string, estado?: string, modalidad?: string, categoria?: string }} filtros
 */
export async function obtenerVacantes(filtros = {}) {
  const params = new URLSearchParams();

  if (filtros.q) params.set('q', filtros.q);
  if (filtros.estado) params.set('estado', filtros.estado);
  if (filtros.modalidad) params.set('modalidad', filtros.modalidad);
  if (filtros.categoria) params.set('categoria', filtros.categoria);

  const queryString = params.toString();
  const url = queryString ? `${API_URL}?${queryString}` : API_URL;

  return solicitar(url, { method: 'GET' });
}

/**
 * Obtiene una vacante por su ID.
 * @param {number|string} id
 */
export async function obtenerVacantePorId(id) {
  return solicitar(`${API_URL}/${id}`, { method: 'GET' });
}

/**
 * Crea una nueva vacante.
 * @param {object} vacante
 */
export async function crearVacante(vacante) {
  return solicitar(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(vacante)
  });
}

/**
 * Reemplaza completamente una vacante existente (PUT).
 * Se usa desde la acción "Editar vacante": el formulario siempre
 * envía el objeto completo, por lo que PUT es el método correcto.
 * @param {number|string} id
 * @param {object} vacante
 */
export async function actualizarVacantePUT(id, vacante) {
  return solicitar(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(vacante)
  });
}

/**
 * Actualiza parcialmente una vacante (PATCH).
 * Se usa desde la acción rápida "Cambiar estado": solo se envía el
 * campo que cambia, sin tocar el resto del recurso.
 * @param {number|string} id
 * @param {object} datosParciales
 */
export async function actualizarVacantePATCH(id, datosParciales) {
  return solicitar(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datosParciales)
  });
}

/**
 * Elimina una vacante.
 * @param {number|string} id
 */
export async function eliminarVacante(id) {
  return solicitar(`${API_URL}/${id}`, { method: 'DELETE' });
}
