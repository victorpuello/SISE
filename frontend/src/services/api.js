// API service para comunicación con el backend Django
import config from './config';

// URL base de la API - Exportar la URL base para que otras partes de la aplicación puedan usarla
export const baseURL = config.apiUrl;

// Obtener token del localStorage
const getToken = () => {
  try {
    const user = JSON.parse(localStorage.getItem(config.storage.userKey));
    return user?.token || null;
  } catch (error) {
    console.error('Error al obtener token:', error);
    return null;
  }
};

// Configuración de headers para las peticiones
const getHeaders = () => {
  const token = getToken();
  const headers = {
    ...config.cors.headers
  };
  
  if (token) {
    headers['Authorization'] = `Token ${token}`;
  }
  
  return headers;
};

// Opciones por defecto para fetch
const getFetchOptions = (options = {}) => {
  return {
    ...options,
    headers: {
      ...getHeaders(),
      ...(options.headers || {})
    },
    credentials: config.cors.credentials,
    timeout: config.timeouts.apiRequest
  };
};

// Función genérica para manejar errores
const handleResponse = async (response) => {
  if (!response.ok) {
    // Intenta parsear el error como JSON
    try {
      const error = await response.json();
      throw new Error(error.detail || error.message || 'Ha ocurrido un error');
    } catch (e) {
      if (response.status === 0) {
        throw new Error('No se pudo conectar con el servidor. Por favor, verifica que el servidor esté en ejecución.');
      }
      throw new Error('Ha ocurrido un error en la comunicación con el servidor');
    }
  }
  
  return response.json();
};

// Métodos del API
const api = {
  // Autenticación
  auth: {
    login: async (credentials) => {
      try {
        console.log('\n=== INICIO DE SOLICITUD LOGIN ===');
        console.log('URL del backend:', baseURL);
        console.log('Email intentando autenticar:', credentials.email);
        
        // Obtener token CSRF primero
        console.log('1. Solicitando CSRF token...');
        try {
          const csrfResponse = await fetch(`${baseURL}/health/`, {
            method: 'GET',
            credentials: 'include',
          });
          console.log('Respuesta CSRF:', csrfResponse.status, csrfResponse.ok);
          if (!csrfResponse.ok) {
            console.error('Error al obtener CSRF token, código:', csrfResponse.status);
          }
        } catch (csrfError) {
          console.error('Error al obtener CSRF token:', csrfError);
        }
        
        console.log('2. Enviando credenciales...');
        // Usar XMLHttpRequest en lugar de fetch para ver más detalles
        return new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open('POST', `${baseURL}/login/`, true);
          xhr.setRequestHeader('Content-Type', 'application/json');
          xhr.setRequestHeader('Accept', 'application/json');
          xhr.withCredentials = true;
          
          xhr.onreadystatechange = function() {
            console.log(`Estado XHR: ${xhr.readyState}, Status: ${xhr.status}`);
            if (xhr.readyState === 4) {
              console.log('Respuesta completa. Status:', xhr.status);
              console.log('Headers de respuesta:', xhr.getAllResponseHeaders());
              
              if (xhr.status >= 200 && xhr.status < 300) {
                console.log('Respuesta exitosa');
                try {
                  const data = JSON.parse(xhr.responseText);
                  console.log('Datos recibidos:', data);
                  
                  if (data.token) {
                    // Guardar el token en localStorage
                    const userData = {
                      ...data,
                      token: data.token
                    };
                    localStorage.setItem(config.storage.userKey, JSON.stringify(userData));
                  }
                  console.log('=== FIN DE SOLICITUD LOGIN (ÉXITO) ===\n');
                  resolve(data);
                } catch (parseError) {
                  console.error('Error al procesar respuesta:', parseError);
                  console.log('Contenido de respuesta:', xhr.responseText);
                  console.log('=== FIN DE SOLICITUD LOGIN (ERROR PARSE) ===\n');
                  reject(parseError);
                }
              } else {
                console.error('Error en la solicitud:', xhr.status);
                console.log('Respuesta de error:', xhr.responseText);
                console.log('=== FIN DE SOLICITUD LOGIN (ERROR HTTP) ===\n');
                try {
                  const errorData = JSON.parse(xhr.responseText);
                  reject(errorData);
                } catch (e) {
                  reject({
                    detail: `Error HTTP ${xhr.status}: ${xhr.statusText || 'Sin mensaje'}`
                  });
                }
              }
            }
          };
          
          xhr.onerror = function(err) {
            console.error('Error de red en la solicitud:', err);
            console.log('=== FIN DE SOLICITUD LOGIN (ERROR DE RED) ===\n');
            reject({
              detail: 'Error de conexión. Verifica que el servidor esté en funcionamiento.'
            });
          };
          
          xhr.send(JSON.stringify({
            email: credentials.email,
            password: credentials.password
          }));
        });
      } catch (error) {
        console.error('Error general en login:', error);
        console.log('=== FIN DE SOLICITUD LOGIN (ERROR GENERAL) ===\n');
        throw error;
      }
    },
    
    logout: async () => {
      const response = await fetch(`${baseURL}/logout/`, {
        method: 'POST',
        headers: getHeaders(),
      });
      
      return handleResponse(response);
    },
    
    getCurrentUser: async () => {
      const token = getToken();
      if (!token) {
        throw new Error('No hay token de autenticación');
      }
      
      const response = await fetch(`${baseURL}/user/`, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return handleResponse(response);
    },
  },
  
  // Usuarios
  usuarios: {
    getAll: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      const url = `${baseURL}/usuarios/${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url, getFetchOptions());
      return handleResponse(response);
    },
    
    getById: async (id) => {
      const response = await fetch(`${baseURL}/usuarios/${id}/`, getFetchOptions());
      return handleResponse(response);
    },
    
    create: async (data) => {
      const response = await fetch(`${baseURL}/usuarios/`, getFetchOptions({
        method: 'POST',
        body: JSON.stringify(data)
      }));
      
      return handleResponse(response);
    },
    
    update: async (id, data) => {
      const response = await fetch(`${baseURL}/usuarios/${id}/`, getFetchOptions({
        method: 'PUT',
        body: JSON.stringify(data)
      }));
      
      return handleResponse(response);
    },
    
    delete: async (id) => {
      const response = await fetch(`${baseURL}/usuarios/${id}/`, getFetchOptions({
        method: 'DELETE'
      }));
      
      return handleResponse(response);
    },
    
    changePassword: async (id, data) => {
      const response = await fetch(`${baseURL}/usuarios/${id}/change_password/`, getFetchOptions({
        method: 'POST',
        body: JSON.stringify(data)
      }));
      
      return handleResponse(response);
    },
    
    activate: async (id) => {
      const response = await fetch(`${baseURL}/usuarios/${id}/activate/`, getFetchOptions({
        method: 'POST'
      }));
      
      return handleResponse(response);
    },
    
    deactivate: async (id) => {
      const response = await fetch(`${baseURL}/usuarios/${id}/deactivate/`, getFetchOptions({
        method: 'POST'
      }));
      
      return handleResponse(response);
    }
  },
  
  // Roles
  roles: {
    getAll: async () => {
      const response = await fetch(`${baseURL}/roles/`, getFetchOptions());
      return handleResponse(response);
    },
    
    getById: async (id) => {
      const response = await fetch(`${baseURL}/roles/${id}/`, getFetchOptions());
      return handleResponse(response);
    }
  },
  
  // Planeaciones
  planeaciones: {
    getAll: async (filters = {}) => {
      const queryParams = new URLSearchParams(filters).toString();
      const url = `${baseURL}/planeaciones/${queryParams ? `?${queryParams}` : ''}`;
      
      const response = await fetch(url, getFetchOptions());
      return handleResponse(response);
    },
    
    getById: async (id) => {
      const response = await fetch(`${baseURL}/planeaciones/${id}/`, getFetchOptions());
      return handleResponse(response);
    },
    
    create: async (data) => {
      const response = await fetch(`${baseURL}/planeaciones/`, getFetchOptions({
        method: 'POST',
        body: JSON.stringify(data)
      }));
      
      return handleResponse(response);
    },
    
    update: async (id, data) => {
      const response = await fetch(`${baseURL}/planeaciones/${id}/`, getFetchOptions({
        method: 'PUT',
        body: JSON.stringify(data)
      }));
      
      return handleResponse(response);
    },
    
    delete: async (id) => {
      const response = await fetch(`${baseURL}/planeaciones/${id}/`, getFetchOptions({
        method: 'DELETE'
      }));
      
      return handleResponse(response);
    }
  },
  
  // Calificaciones
  calificaciones: {
    getAll: async (filters = {}) => {
      const queryParams = new URLSearchParams(filters).toString();
      const url = `${baseURL}/calificaciones/${queryParams ? `?${queryParams}` : ''}`;
      
      const response = await fetch(url, getFetchOptions());
      return handleResponse(response);
    },
    
    getById: async (id) => {
      const response = await fetch(`${baseURL}/calificaciones/${id}/`, getFetchOptions());
      return handleResponse(response);
    },
    
    create: async (data) => {
      const response = await fetch(`${baseURL}/calificaciones/`, getFetchOptions({
        method: 'POST',
        body: JSON.stringify(data)
      }));
      
      return handleResponse(response);
    },
    
    update: async (id, data) => {
      const response = await fetch(`${baseURL}/calificaciones/${id}/`, getFetchOptions({
        method: 'PUT',
        body: JSON.stringify(data)
      }));
      
      return handleResponse(response);
    },
    
    delete: async (id) => {
      const response = await fetch(`${baseURL}/calificaciones/${id}/`, getFetchOptions({
        method: 'DELETE'
      }));
      
      return handleResponse(response);
    }
  },
  
  // Asistencias
  asistencias: {
    getAll: async (filters = {}) => {
      const queryParams = new URLSearchParams(filters).toString();
      const url = `${baseURL}/asistencias/${queryParams ? `?${queryParams}` : ''}`;
      
      const response = await fetch(url, getFetchOptions());
      return handleResponse(response);
    },
    
    getByDate: async (date, grupo) => {
      const queryParams = new URLSearchParams({ fecha: date, grupo }).toString();
      const response = await fetch(`${baseURL}/asistencias/?${queryParams}`, getFetchOptions());
      
      return handleResponse(response);
    },
    
    create: async (data) => {
      const response = await fetch(`${baseURL}/asistencias/`, getFetchOptions({
        method: 'POST',
        body: JSON.stringify(data)
      }));
      
      return handleResponse(response);
    },
    
    update: async (id, data) => {
      const response = await fetch(`${baseURL}/asistencias/${id}/`, getFetchOptions({
        method: 'PUT',
        body: JSON.stringify(data)
      }));
      
      return handleResponse(response);
    },
    
    delete: async (id) => {
      const response = await fetch(`${baseURL}/asistencias/${id}/`, getFetchOptions({
        method: 'DELETE'
      }));
      
      return handleResponse(response);
    }
  },
  
  // Observador
  observador: {
    getAll: async (filters = {}) => {
      const queryParams = new URLSearchParams(filters).toString();
      const url = `${baseURL}/observaciones/${queryParams ? `?${queryParams}` : ''}`;
      
      const response = await fetch(url, getFetchOptions());
      return handleResponse(response);
    },
    
    getById: async (id) => {
      const response = await fetch(`${baseURL}/observaciones/${id}/`, getFetchOptions());
      return handleResponse(response);
    },
    
    create: async (data) => {
      const response = await fetch(`${baseURL}/observaciones/`, getFetchOptions({
        method: 'POST',
        body: JSON.stringify(data)
      }));
      
      return handleResponse(response);
    },
    
    update: async (id, data) => {
      const response = await fetch(`${baseURL}/observaciones/${id}/`, getFetchOptions({
        method: 'PUT',
        body: JSON.stringify(data)
      }));
      
      return handleResponse(response);
    },
    
    delete: async (id) => {
      const response = await fetch(`${baseURL}/observaciones/${id}/`, getFetchOptions({
        method: 'DELETE'
      }));
      
      return handleResponse(response);
    }
  },
  
  // Reportes
  reportes: {
    getRendimientoAcademico: async (filters = {}) => {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetch(`${baseURL}/reportes/rendimiento/${queryParams ? `?${queryParams}` : ''}`, getFetchOptions());
      
      return handleResponse(response);
    },
    
    getAsistencia: async (filters = {}) => {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetch(`${baseURL}/reportes/asistencia/${queryParams ? `?${queryParams}` : ''}`, getFetchOptions());
      
      return handleResponse(response);
    },
    
    getObservador: async (filters = {}) => {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetch(`${baseURL}/reportes/observador/${queryParams ? `?${queryParams}` : ''}`, getFetchOptions());
      
      return handleResponse(response);
    },
    
    getComparativo: async (filters = {}) => {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetch(`${baseURL}/reportes/comparativo/${queryParams ? `?${queryParams}` : ''}`, getFetchOptions());
      
      return handleResponse(response);
    }
  }
};

export default api;