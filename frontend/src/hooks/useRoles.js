import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const useRoles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar roles
  const loadRoles = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await api.roles.getAll();
      setRoles(data.results || data);
    } catch (err) {
      setError(err.message || 'Error al cargar roles. Por favor, actualice la página e inténtelo de nuevo.');
      console.error('Error al cargar roles:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar roles al montar el componente
  useEffect(() => {
    loadRoles();
  }, [loadRoles]);

  // Obtener un rol por su ID
  const getRolById = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const rol = await api.roles.getById(id);
      return { success: true, data: rol };
    } catch (err) {
      setError(err.message || 'Error al obtener información del rol. Por favor, inténtelo de nuevo.');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    roles,
    loading,
    error,
    loadRoles,
    getRolById
  };
};

export default useRoles; 