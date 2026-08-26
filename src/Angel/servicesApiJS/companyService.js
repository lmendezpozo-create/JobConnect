/**
 * SERVICIO MÓDULO EMPRESAS CLIENTES — Angel (adaptado para json-server /empresas)
 */
import { customFetch } from './api.js';

export const CompanyService = {
  async getAll() {
    return await customFetch('/empresas', { method: 'GET' });
  },

  async getById(id) {
    if (!id) throw new Error('El ID de la empresa es obligatorio.');
    return await customFetch(`/empresas/${id}`, { method: 'GET' });
  },

  async create(companyData = {}) {
    return await customFetch('/empresas', {
      method: 'POST',
      body: JSON.stringify(companyData)
    });
  },

  async update(id, updatedFields = {}) {
    if (!id) throw new Error('El ID de la empresa es obligatorio para actualizar.');
    return await customFetch(`/empresas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updatedFields)
    });
  },

  async remove(id) {
    if (!id) throw new Error('El ID de la empresa es obligatorio para eliminar.');
    return await customFetch(`/empresas/${id}`, { method: 'DELETE' });
  }
};
