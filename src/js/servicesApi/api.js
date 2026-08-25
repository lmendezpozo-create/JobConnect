/**
 * SERVICIO BASE DE CONEXIÓN A LA API (JobConnect - Malka Brete)
 * Centraliza las peticiones Fetch con async/await, inyección de Token y try/catch.
 */

const BASE_URL = 'https://dummyjson.com';

/**
 * Obtiene el token de autenticación desde el almacenamiento local
 * @returns {string|null} Token de usuario o null si no existe
 */
export function getAuthToken() {
  return localStorage.getItem('authToken');
}

/**
 * Cierra la sesión del usuario eliminando las credenciales y redirigiendo al Login
 */
export function logoutUser() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userData');
  window.location.href = '../../../index.html'; // Redirección a la pantalla de Login
}

/**
 * Wrapper reutilizable y paramétrico para peticiones HTTP
 * @param {string} endpoint - Recurso relativo de la API (ej: '/carts')
 * @param {object} options - Configuración de la petición (method, headers, body)
 * @returns {Promise<{data: any, error: string|null}>} Respuesta estandarizada
 */
export async function customFetch(endpoint, options = {}) {
  const token = getAuthToken();

  // Control de Acceso: Redirigir al login si no hay token de sesión
  if (!token && !endpoint.includes('/auth/login')) {
    console.warn('Acceso denegado: No existe un token activo.');
    logoutUser();
    return { data: null, error: 'Sesión no válida o expirada.' };
  }

  // Configuración de cabeceras predeterminadas con Authorization Bearer
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      if (response.status === 401) {
        logoutUser();
        throw new Error('Sesión expirada. Por favor inicie sesión nuevamente.');
      }
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error(`[API Error - ${endpoint}]:`, error.message);
    return { 
      data: null, 
      error: error.message || 'Error de red o conexión con el servidor.' 
    };
  }
}