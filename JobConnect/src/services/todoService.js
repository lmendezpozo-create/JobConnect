// src/services/todoService.js
import api from './api';

const BASE_URL = '/api/todos';

export const todoService = {
  // Obtener todas las tareas
  getAll: async () => {
    const response = await api.get(BASE_URL);
    return response.data;
  },

  // Obtener una tarea por ID
  getById: async (id) => {
    const response = await api.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Crear nueva tarea
  create: async (data) => {
    const response = await api.post(BASE_URL, data);
    return response.data;
  },

  // Actualizar completamente una tarea (PUT)
  updateFull: async (id, data) => {
    const response = await api.put(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  // Actualizar parcialmente (solo cambio de estado)
  updatePartial: async (id, data) => {
    const response = await api.patch(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  // Eliminar una tarea
  delete: async (id) => {
    const response = await api.delete(`${BASE_URL}/${id}`);
    return response.data;
  },
};