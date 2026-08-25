// src/hooks/useCrud.js
import { useState, useCallback } from 'react';

/**
 * Hook genérico para manejar operaciones CRUD
 * @param {Object} service - Servicio con métodos getAll, create, update, delete, etc.
 * @returns {Object} Estado y funciones para manejar CRUD
 */
export const useCrud = (service) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener todos los registros
  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await service.getAll();
      setData(result);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al obtener datos');
    } finally {
      setLoading(false);
    }
  }, [service]);

  // Crear nuevo registro
  const create = useCallback(async (newItem) => {
    setLoading(true);
    setError(null);
    try {
      const result = await service.create(newItem);
      setData((prev) => [...prev, result]);
      return result;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear registro');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [service]);

  // Actualizar registro (genérico)
  const update = useCallback(async (id, updatedData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await service.updatePartial(id, updatedData);
      setData((prev) => prev.map((item) => (item.id === id ? result : item)));
      return result;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar registro');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [service]);

  // Eliminar registro
  const remove = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await service.delete(id);
      setData((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar registro');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [service]);

  // Limpiar error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    data,
    loading,
    error,
    fetchAll,
    create,
    update,
    remove,
    clearError,
  };
};