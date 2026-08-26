/**
 * SERVICIO BASE DE CONEXIÓN A LA API — Angel (adaptado para json-server)
 */
const BASE_URL = 'http://localhost:3000';

export function getAuthToken() {
  return localStorage.getItem('jobconnect_session');
}

export function logoutUser() {
  localStorage.removeItem('jobconnect_session');
  window.location.href = '../../../index.html';
}

export async function customFetch(endpoint, options = {}) {
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    if (response.status === 204) return { data: null, error: null };
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error(`[API Error - ${endpoint}]:`, error.message);
    return { data: null, error: error.message || 'Error de red.' };
  }
}
