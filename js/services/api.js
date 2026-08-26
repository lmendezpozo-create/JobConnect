// js/services/api.js
// Cliente HTTP mínimo encima de fetch para comunicarse con el json-server.
// Todas las demás capas (servicios) dependen de estas funciones.

export const BASE_URL = 'http://localhost:3000';

/**
 * Petición HTTP con JSON.
 * @param {string} endpoint - Ruta tras el BASE_URL, p.ej. "/comments".
 * @param {object} [options] - Opciones de fetch (method, body, headers…).
 */
export const fetchApi = async (endpoint, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error ${response.status}`);
  }

  // 204 = sin contenido
  if (response.status === 204) {
    return null;
  }

  return response.json();
};