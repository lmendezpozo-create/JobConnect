// js/services/interviewService.js
// CRUD de Entrevistas sobre el recurso /entrevistas del json-server (db.json).
// Expone nombres específicos y alias genéricos (getAll/createItem/updateItem/deleteItem)
// para que el hook useCrud sea agnóstico al tipo de recurso.

import { fetchApi } from './api.js';

const RESOURCE = '/entrevistas';

const buildListEndpoint = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return queryString ? `${RESOURCE}?${queryString}` : RESOURCE;
};

const buildItemEndpoint = (id) => `${RESOURCE}/${encodeURIComponent(id)}`;

// GET /entrevistas
export const getInterviews = (params = {}) => fetchApi(buildListEndpoint(params));
export const getAll = getInterviews;

// POST /entrevistas
export const createInterview = (data) =>
  fetchApi(RESOURCE, { method: 'POST', body: JSON.stringify(data) });
export const createItem = createInterview;

// PATCH /entrevistas/:id
export const updateInterview = (id, data) =>
  fetchApi(buildItemEndpoint(id), { method: 'PATCH', body: JSON.stringify(data) });
export const updateItem = updateInterview;

// DELETE /entrevistas/:id
export const deleteInterview = (id) =>
  fetchApi(buildItemEndpoint(id), { method: 'DELETE' });
export const deleteItem = deleteInterview;