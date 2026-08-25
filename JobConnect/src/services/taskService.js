// src/services/todoService.js
import { fetchApi } from './fetch.js';

const RESOURCE = '/todos';

// GET /todos
export const getTodos = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const endpoint = queryString ? `${RESOURCE}?${queryString}` : RESOURCE;
  return fetchApi(endpoint);
};

// POST /todos
export const createTodo = async (data) => {
  return fetchApi(RESOURCE, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// PUT /todos/:id – Reemplazo completo
export const updateTodo = async (id, data) => {
  return fetchApi(`${RESOURCE}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

// PATCH /todos/:id – Actualización parcial
export const patchTodo = async (id, data) => {
  return fetchApi(`${RESOURCE}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

// DELETE /todos/:id
export const deleteTodo = async (id) => {
  return fetchApi(`${RESOURCE}/${id}`, {
    method: 'DELETE',
  });
};