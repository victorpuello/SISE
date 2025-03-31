import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import api, { baseURL } from '../services/api';
import config from '../services/config';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);

  // Verificar si hay un token almacenado al cargar la aplicación
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      try {
        // Obtener datos de usuario almacenados
        const storedUser = localStorage.getItem(config.storage.userKey);
        
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            
            if (userData && userData.token) {
              // Configurar el token en el encabezado para todas las solicitudes
              axios.defaults.headers.common['Authorization'] = `Token ${userData.token}`;
              
              // Obtener información actualizada del usuario actual
              const response = await axios.get(`${baseURL}/user/`, {
                headers: {
                  'Accept': 'application/json',
                },
                withCredentials: true
              });
              
              if (response.data) {
                // Normalizar el rol para consistencia
                const freshUserData = {
                  ...response.data,
                  token: userData.token, // Mantener el token original
                  rol: normalizeRole(response.data.rol)
                };
                
                setUser(freshUserData);
                console.log('Usuario autenticado:', freshUserData);
              }
            }
          } catch (parseError) {
            console.error('Error al parsear datos de usuario:', parseError);
            localStorage.removeItem(config.storage.userKey);
          }
        }
      } catch (error) {
        console.error('Error al verificar autenticación:', error);
        localStorage.removeItem(config.storage.userKey);
        delete axios.defaults.headers.common['Authorization'];
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    checkAuth();
  }, []);

  // Función para normalizar el rol del usuario
  const normalizeRole = (role) => {
    if (!role) return 'estudiante';
    
    const roleMap = {
      'admin': 'Administrador',
      'administrador': 'Administrador',
      'director': 'Director',
      'profesor': 'Docente',
      'docente': 'Docente',
      'estudiante': 'Estudiante',
      'acudiente': 'Acudiente'
    };
    
    const normalizedRole = roleMap[role.toLowerCase()];
    return normalizedRole || role;
  };

  // Función para iniciar sesión
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Intentando iniciar sesión con:', { email });
      // Intenta obtener token CSRF primero
      try {
        await fetch(`${baseURL}/health/`, {
          method: 'GET',
          credentials: 'include',
        });
      } catch (csrfError) {
        console.log('Error al obtener CSRF token:', csrfError);
      }
      
      const response = await axios.post(`${baseURL}/login/`, { email, password }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        withCredentials: true, // Importante para CORS con credenciales
      });
      
      console.log('Respuesta de inicio de sesión:', response.data);
      
      if (response.data && response.data.token) {
        // Guardar datos completos de usuario con el token
        const userData = {
          ...response.data,
          rol: normalizeRole(response.data.rol)
        };
        
        // Guardar en localStorage
        localStorage.setItem(config.storage.userKey, JSON.stringify(userData));
        
        // Configurar axios para futuras peticiones
        axios.defaults.headers.common['Authorization'] = `Token ${response.data.token}`;
        
        setUser(userData);
        console.log('Inicio de sesión exitoso:', userData);
        return userData;
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      
      if (error.response && error.response.status === 403) {
        setError('Error 403: Posible problema con CSRF o permisos. Por favor, intente más tarde.');
        console.error('Error 403 - Detalles:', error.response.data);
      } else {
        setError(
          error.response?.data?.detail || 
          error.response?.data?.message || 
          'Error al iniciar sesión. Por favor, verifica tus credenciales.'
        );
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Función para cerrar sesión
  const logout = async () => {
    console.log('\n=== INICIO DE LOGOUT ===');
    try {
      if (user?.token) {
        console.log('Enviando solicitud de logout al servidor...');
        // Usar api.auth.logout directamente
        await fetch(`${baseURL}/logout/`, {
          method: 'POST',
          headers: {
            'Authorization': `Token ${user.token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });
      }
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      console.log('Limpiando datos de sesión...');
      localStorage.removeItem(config.storage.userKey);
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      console.log('=== FIN DE LOGOUT ===\n');
    }
  };

  // Función para cambiar la contraseña del perfil
  const changePassword = async (passwordData) => {
    try {
      const response = await axios.post(
        `${baseURL}/usuarios/${user.id}/change_password/`, 
        passwordData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          withCredentials: true
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      throw error;
    }
  };

  // Comprobar si el usuario tiene un rol específico
  const hasRole = (role) => {
    if (!user) return false;
    return user.rol.toLowerCase() === role.toLowerCase();
  };

  // Funciones de ayuda para verificar roles específicos
  const isAdmin = () => hasRole('Administrador');
  const isTeacher = () => hasRole('Docente');
  const isStudent = () => hasRole('Estudiante');
  const isGuardian = () => hasRole('Acudiente');
  const isCoordinator = () => hasRole('Director');

  const value = {
    user,
    loading,
    error,
    initialized,
    login,
    logout,
    changePassword,
    isAdmin,
    isTeacher,
    isStudent,
    isGuardian,
    isCoordinator
  };

  console.log('\n=== ESTADO ACTUAL DEL CONTEXTO ===');
  console.log(value);
  console.log('=== FIN DE ESTADO ===\n');

  // No renderizar nada hasta que la inicialización esté completa
  if (!initialized) {
    console.log('Esperando inicialización...');
    return null;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}; 