// src/hooks/useFetch.js
import { useState, useCallback } from 'react';

export const useFetch = (service) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const result = await service.getInterviews?.(params) || await service.getTasks?.(params);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [service]);

  const create = useCallback(async (item) => {
    setLoading(true);
    setError(null);
    try {
      const result = await service.createInterview?.(item) || await service.createTask?.(item);
      setData((prev) => [result, ...prev]);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [service]);

  const update = useCallback(async (id, item, method = 'patch') => {
    setLoading(true);
    setError(null);
    try {
      let result;
      if (method === 'put') {
        result = await service.updateTask?.(id, item);
      } else {
        result = await service.updateInterview?.(id, item) || await service.patchTask?.(id, item);
      }
      setData((prev) => prev.map((el) => (el.id === id ? result : el)));
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [service]);

  const remove = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await service.deleteInterview?.(id) || await service.deleteTask?.(id);
      setData((prev) => prev.filter((el) => el.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [service]);

  return { data, setData, loading, error, fetchAll, create, update, remove };
};