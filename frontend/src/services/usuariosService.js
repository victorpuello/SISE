import axios from 'axios';

// Configuración base de axios para todas las peticiones
const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api/usuarios',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token de autenticación
apiClient.interceptors.request.use(
  (config) => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Obtener todos los usuarios con posibilidad de paginación y filtros
const getUsuarios = async (page = 1, filters = {}) => {
  try {
    const params = { page, ...filters };
    const response = await apiClient.get('/', { params });
    return response.data;
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error;
  }
};

// Obtener un usuario específico por ID
const getUsuario = async (id) => {
  try {
    const response = await apiClient.get(`/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener usuario con ID ${id}:`, error);
    throw error;
  }
};

// Crear un nuevo usuario
const createUsuario = async (usuarioData) => {
  try {
    const response = await apiClient.post('/', usuarioData);
    return response.data;
  } catch (error) {
    console.error('Error al crear usuario:', error);
    throw error;
  }
};

// Actualizar un usuario existente
const updateUsuario = async (id, usuarioData) => {
  try {
    const response = await apiClient.put(`/${id}/`, usuarioData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar usuario con ID ${id}:`, error);
    throw error;
  }
};

// Eliminar un usuario
const deleteUsuario = async (id) => {
  try {
    const response = await apiClient.delete(`/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar usuario con ID ${id}:`, error);
    throw error;
  }
};

// Cambiar contraseña de un usuario
const changePassword = async (id, passwordData) => {
  try {
    const response = await apiClient.post(`/${id}/cambiar-password/`, passwordData);
    return response.data;
  } catch (error) {
    console.error(`Error al cambiar contraseña del usuario con ID ${id}:`, error);
    throw error;
  }
};

export const usuariosService = {
  getUsuarios,
  getUsuario,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  changePassword
}; 