// src/services/interviewService.js
import { fetchApi } from './api';

const RESOURCE = '/comments';

// GET /comments – Obtener todas las entrevistas
export const getInterviews = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const endpoint = queryString ? `${RESOURCE}?${queryString}` : RESOURCE;
  return fetchApi(endpoint);
};

// POST /comments – Crear una nueva entrevista
export const createInterview = async (data) => {
  return fetchApi(RESOURCE, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// PATCH /comments/:id – Actualizar parcialmente
export const updateInterview = async (id, data) => {
  return fetchApi(`${RESOURCE}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

// DELETE /comments/:id – Eliminar
export const deleteInterview = async (id) => {
  return fetchApi(`${RESOURCE}/${id}`, {
    method: 'DELETE',
  });
};