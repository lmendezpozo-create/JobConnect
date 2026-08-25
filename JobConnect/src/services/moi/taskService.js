import { fetchApi } from './fetch.js';

const RESOURCE = '/tasks';

/**
 * Construye el endpoint de listado incluyendo los parámetros de filtrado.
 * @param {Record<string, string | number | boolean | undefined>} params
 * @returns {string}
 */
const buildListEndpoint = (params) => {
  const queryString = new URLSearchParams(params).toString();
  return queryString ? `${RESOURCE}?${queryString}` : RESOURCE;
};

/**
 * Construye el endpoint de un recurso individual, escapando el id.
 * @param {string | number} id
 * @returns {string}
 */
const buildItemEndpoint = (id) => `${RESOURCE}/${encodeURIComponent(id)}`;

/**
 * Asegura que el id sea válido antes de realizar la petición.
 * @param {unknown} id
 */
const assertValidId = (id) => {
  if (id === undefined || id === null || id === '') {
    throw new TypeError('Se requiere un id válido para operar sobre una tarea.');
  }
};

/**
 * Envía una petición con cuerpo JSON.
 * @param {'POST' | 'PUT' | 'PATCH'} method
 * @param {string} endpoint
 * @param {unknown} data
 * @returns {Promise<unknown>}
 */
const sendData = (method, endpoint, data) =>
  fetchApi(endpoint, {
    method,
    body: JSON.stringify(data),
  });

// GET /tasks
export const getTasks = async (params = {}) => fetchApi(buildListEndpoint(params));

// GET /tasks/:id – Obtener una tarea
export const getTaskById = async (id) => {
  assertValidId(id);
  return fetchApi(buildItemEndpoint(id));
};

// POST /tasks
export const createTask = async (data) => sendData('POST', RESOURCE, data);

// PUT /tasks/:id – Reemplazo completo
export const updateTask = async (id, data) => {
  assertValidId(id);
  return sendData('PUT', buildItemEndpoint(id), data);
};

// PATCH /tasks/:id – Actualización parcial
export const patchTask = async (id, data) => {
  assertValidId(id);
  return sendData('PATCH', buildItemEndpoint(id), data);
};

// DELETE /tasks/:id
export const deleteTask = async (id) => {
  assertValidId(id);
  return fetchApi(buildItemEndpoint(id), { method: 'DELETE' });
};