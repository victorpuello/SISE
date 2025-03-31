import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const useAsistencias = (initialFilters = {}) => {
  const [asistencias, setAsistencias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  // Cargar asistencias desde el API
  const loadAsistencias = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.asistencias.getAll(filters);
      setAsistencias(data);
    } catch (err) {
      setError(err.message || 'Error al cargar las asistencias');
      console.error('Error al cargar asistencias:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Cargar al montar el componente y cuando cambian los filtros
  useEffect(() => {
    loadAsistencias();
  }, [loadAsistencias]);

  // Actualizar los filtros
  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Registrar una nueva asistencia
  const createAsistencia = async (asistenciaData) => {
    setLoading(true);
    setError(null);
    try {
      const newAsistencia = await api.asistencias.create(asistenciaData);
      setAsistencias(prev => [...prev, newAsistencia]);
      return { success: true, data: newAsistencia };
    } catch (err) {
      setError(err.message || 'Error al registrar la asistencia');
      console.error('Error al registrar asistencia:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Actualizar una asistencia existente
  const updateAsistencia = async (id, asistenciaData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedAsistencia = await api.asistencias.update(id, asistenciaData);
      setAsistencias(prev => 
        prev.map(item => item.id === id ? updatedAsistencia : item)
      );
      return { success: true, data: updatedAsistencia };
    } catch (err) {
      setError(err.message || 'Error al actualizar la asistencia');
      console.error('Error al actualizar asistencia:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Eliminar una asistencia
  const deleteAsistencia = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await api.asistencias.delete(id);
      setAsistencias(prev => prev.filter(item => item.id !== id));
      return { success: true };
    } catch (err) {
      setError(err.message || 'Error al eliminar la asistencia');
      console.error('Error al eliminar asistencia:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    asistencias,
    loading,
    error,
    filters,
    updateFilters,
    loadAsistencias,
    createAsistencia,
    updateAsistencia,
    deleteAsistencia
  };
};

export default useAsistencias; 