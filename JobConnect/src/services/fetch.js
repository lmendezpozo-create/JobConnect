const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Interceptor de Request: Agrega token JWT automáticamente
 */
const requestInterceptor = (config) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...config.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return { ...config, headers };
};

/**
 * Interceptor de Response: Maneja errores 401
 */
const responseInterceptor = async (response) => {
  if (response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
  }
  return response;
};

/**
 * Función principal de fetch con interceptores
 * @param {string} endpoint - Ruta del endpoint (ej: '/api/comments')
 * @param {Object} options - Opciones de fetch (method, body, etc.)
 * @returns {Promise<any>} Datos de la respuesta
 */
export const apiFetch = async (endpoint, options = {}) => {
  const config = {
    method: options.method || 'GET',
    headers: options.headers || {},
    body: options.body,
  };

  // Aplicar interceptor de request
  const interceptedConfig = requestInterceptor(config);

  // Si no hay body, eliminar el header
  if (!interceptedConfig.body) {
    delete interceptedConfig.body;
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, interceptedConfig);

    // Aplicar interceptor de response
    await responseInterceptor(response);

    // Manejar respuestas vacías (204 No Content, DELETE exitoso)
    if (response.status === 204) {
      return null;
    }

    // Parsear JSON
    const data = await response.json();

    // Si la respuesta no es OK, lanzar error
    if (!response.ok) {
      const error = new Error(data.message || 'Error en la petición');
      error.response = { status: response.status, data };
      throw error;
    }

    return data;
  } catch (error) {
    // Si el error es de red (sin respuesta)
    if (!error.response) {
      error.response = { status: 0, data: { message: 'Error de conexión' } };
    }
    throw error;
  }
};

// Métodos helper para facilitar el uso
export const api = {
  get: (endpoint) => apiFetch(endpoint, { method: 'GET' }),
  post: (endpoint, data) =>
    apiFetch(endpoint, { method: 'POST', body: JSON.stringify(data) }),
  put: (endpoint, data) =>
    apiFetch(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
  patch: (endpoint, data) =>
    apiFetch(endpoint, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (endpoint) => apiFetch(endpoint, { method: 'DELETE' }),
};

export default api;