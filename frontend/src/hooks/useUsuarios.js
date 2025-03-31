import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const useUsuarios = (initialParams = {}) => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
    current: 1,
    pageSize: 10,
  });

  // Cargar usuarios
  const loadUsuarios = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const queryParams = {
        ...params,
        page,
      };
      
      const data = await api.usuarios.getAll(queryParams);
      
      setUsuarios(data.results || data);
      
      if (data.count !== undefined) {
        setPagination({
          count: data.count,
          next: data.next,
          previous: data.previous,
          current: page,
          pageSize: 10,
        });
      }
    } catch (err) {
      setError(err.message || 'Error al cargar usuarios. Por favor, inténtelo de nuevo.');
      console.error('Error al cargar usuarios:', err);
    } finally {
      setLoading(false);
    }
  }, [params]);

  // Efecto para cargar usuarios cuando cambian los parámetros
  useEffect(() => {
    loadUsuarios(1);
  }, [loadUsuarios]);

  // Actualizar parámetros de búsqueda y filtrado
  const updateParams = (newParams) => {
    setParams(prev => ({ ...prev, ...newParams }));
  };

  // Crear usuario
  const createUsuario = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const newUser = await api.usuarios.create(userData);
      setUsuarios(prev => [...prev, newUser]);
      return { success: true, data: newUser };
    } catch (err) {
      setError(err.message || 'Error al crear usuario. Por favor, verifique los datos e inténtelo de nuevo.');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Actualizar usuario
  const updateUsuario = async (id, userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedUser = await api.usuarios.update(id, userData);
      setUsuarios(prev => 
        prev.map(user => user.id === id ? updatedUser : user)
      );
      return { success: true, data: updatedUser };
    } catch (err) {
      setError(err.message || 'Error al actualizar usuario. Por favor, verifique los datos e inténtelo de nuevo.');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Eliminar usuario
  const deleteUsuario = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      await api.usuarios.delete(id);
      setUsuarios(prev => prev.filter(user => user.id !== id));
      return { success: true };
    } catch (err) {
      setError(err.message || 'Error al eliminar usuario. El usuario podría estar asociado a otros registros.');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Cambiar contraseña
  const changePassword = async (id, passwordData) => {
    setLoading(true);
    setError(null);
    
    try {
      await api.usuarios.changePassword(id, passwordData);
      return { success: true };
    } catch (err) {
      setError(err.message || 'Error al cambiar la contraseña. Por favor, inténtelo de nuevo.');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Activar usuario
  const activateUsuario = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      await api.usuarios.activate(id);
      setUsuarios(prev => 
        prev.map(user => user.id === id ? { ...user, is_active: true } : user)
      );
      return { success: true };
    } catch (err) {
      setError(err.message || 'Error al activar el usuario. Por favor, inténtelo de nuevo.');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Desactivar usuario
  const deactivateUsuario = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      await api.usuarios.deactivate(id);
      setUsuarios(prev => 
        prev.map(user => user.id === id ? { ...user, is_active: false } : user)
      );
      return { success: true };
    } catch (err) {
      setError(err.message || 'Error al desactivar el usuario. Por favor, inténtelo de nuevo.');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    usuarios,
    loading,
    error,
    params,
    pagination,
    loadUsuarios,
    updateParams,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    changePassword,
    activateUsuario,
    deactivateUsuario
  };
};

export default useUsuarios; 