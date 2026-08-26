// js/services/interviewService.js
// CRUD de Entrevistas sobre el recurso /comments del json-server.
// Expone nombres específicos y alias genéricos (getAll/createItem/updateItem/deleteItem)
// para que el hook useCrud sea agnóstico al tipo de recurso.

import { fetchApi } from './api.js';

const RESOURCE = '/comments';

const buildListEndpoint = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return queryString ? `${RESOURCE}?${queryString}` : RESOURCE;
};

const buildItemEndpoint = (id) => `${RESOURCE}/${encodeURIComponent(id)}`;

// GET /comments
export const getInterviews = (params = {}) => fetchApi(buildListEndpoint(params));
export const getAll = getInterviews;

// POST /comments
export const createInterview = (data) =>
  fetchApi(RESOURCE, { method: 'POST', body: JSON.stringify(data) });
export const createItem = createInterview;

// PATCH /comments/:id
export const updateInterview = (id, data) =>
  fetchApi(buildItemEndpoint(id), { method: 'PATCH', body: JSON.stringify(data) });
export const updateItem = updateInterview;

// DELETE /comments/:id
export const deleteInterview = (id) =>
  fetchApi(buildItemEndpoint(id), { method: 'DELETE' });
export const deleteItem = deleteInterview;