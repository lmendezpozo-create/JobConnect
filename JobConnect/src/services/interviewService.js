// src/services/interviewService.js
import api from './api';

const BASE_URL = '/api/comments';

export const interviewService = {
  // Obtener todas las entrevistas
  getAll: async () => {
    const response = await api.get(BASE_URL);
    return response.data;
  },

  // Obtener una entrevista por ID
  getById: async (id) => {
    const response = await api.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Crear nueva entrevista
  create: async (data) => {
    const response = await api.post(BASE_URL, data);
    return response.data;
  },

  // Actualizar parcialmente una entrevista
  updatePartial: async (id, data) => {
    const response = await api.patch(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  // Eliminar una entrevista
  delete: async (id) => {
    const response = await api.delete(`${BASE_URL}/${id}`);
    return response.data;
  },
};