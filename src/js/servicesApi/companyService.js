/**
 * SERVICIO MÓDULO EMPRESAS CLIENTES (/carts)
 * Capa de datos para la gestión corporativa de JobConnect
 */
import { customFetch } from './api.js';

export const CompanyService = {
  /**
   * Obtiene la lista de empresas clientes con parámetros de paginación
   * @param {object} params - Parámetros de consulta { limit, skip }
   */
  async getAll({ limit = 10, skip = 0 } = {}) {
    return await customFetch(`/carts?limit=${limit}&skip=${skip}`, {
      method: 'GET'
    });
  },

  /**
   * Obtiene una empresa cliente por su ID
   * @param {number|string} id - Identificador de la empresa
   */
  async getById(id) {
    if (!id) throw new Error('El ID de la empresa es obligatorio.');
    return await customFetch(`/carts/${id}`, { method: 'GET' });
  },

  /**
   * Registra una nueva empresa cliente (POST)
   * @param {object} companyData - Datos de la empresa { userId, total, products }
   */
  async create(companyData = {}) {
    return await customFetch('/carts/add', {
      method: 'POST',
      body: JSON.stringify(companyData)
    });
  },

  /**
   * Actualiza los datos de una empresa registrada (PUT)
   * @param {number|string} id - ID de la empresa a modificar
   * @param {object} updatedFields - Objeto con los datos actualizados
   */
  async update(id, updatedFields = {}) {
    if (!id) throw new Error('El ID de la empresa es obligatorio para actualizar.');
    return await customFetch(`/carts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updatedFields)
    });
  },

  /**
   * Elimina un registro de empresa cliente (DELETE)
   * @param {number|string} id - ID de la empresa a eliminar
   */
  async remove(id) {
    if (!id) throw new Error('El ID de la empresa es obligatorio para eliminar.');
    return await customFetch(`/carts/${id}`, { method: 'DELETE' });
  }
};