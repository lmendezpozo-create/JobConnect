// src/services/users.js
import { fetchApi } from './fetch.js';

const RESOURCE = '/users';

// GET /users – Obtener todos los usuarios
export const getUsers = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const endpoint = queryString ? `${RESOURCE}?${queryString}` : RESOURCE;
  return fetchApi(endpoint);
};

// POST /users – Crear un nuevo usuario
export const createUser = async (data) => {
  return fetchApi(RESOURCE, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// GET /users/:id – Obtener un usuario
export const getUserById = async (id) => {
  return fetchApi(`${RESOURCE}/${id}`);
};

// PATCH /users/:id – Actualizar parcialmente un usuario
export const updateUser = async (id, data) => {
  return fetchApi(`${RESOURCE}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

// DELETE /users/:id – Eliminar un usuario
export const deleteUser = async (id) => {
  return fetchApi(`${RESOURCE}/${id}`, {
    method: 'DELETE',
  });
};
