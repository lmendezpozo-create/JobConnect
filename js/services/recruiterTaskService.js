// js/services/recruiterTaskService.js
// CRUD de Tareas del reclutador sobre el recurso /all del json-server.
// - updateTask  → PUT  /all/:id (edición completa desde el modal)
// - patchTask   → PATCH /all/:id (cambio puntual de estado desde la tarjeta)
// Expone alias genéricos para useCrud (updateItem = updateTask = PUT).

import { fetchApi } from './api.js';

const RESOURCE = '/all';

const buildListEndpoint = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return queryString ? `${RESOURCE}?${queryString}` : RESOURCE;
};

const buildItemEndpoint = (id) => `${RESOURCE}/${encodeURIComponent(id)}`;

// GET /all
export const getTasks = (params = {}) => fetchApi(buildListEndpoint(params));
export const getAll = getTasks;

// POST /all
export const createTask = (data) =>
  fetchApi(RESOURCE, { method: 'POST', body: JSON.stringify(data) });
export const createItem = createTask;

// PUT /all/:id — reemplazo completo
export const updateTask = (id, data) =>
  fetchApi(buildItemEndpoint(id), { method: 'PUT', body: JSON.stringify(data) });
export const updateItem = updateTask;

// PATCH /all/:id — actualización parcial (estado desde la tarjeta)
export const patchTask = (id, data) =>
  fetchApi(buildItemEndpoint(id), { method: 'PATCH', body: JSON.stringify(data) });
export const patchItem = patchTask;

// DELETE /all/:id
export const deleteTask = (id) =>
  fetchApi(buildItemEndpoint(id), { method: 'DELETE' });
export const deleteItem = deleteTask;