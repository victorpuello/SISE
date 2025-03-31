import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import useUsuarios from '../hooks/useUsuarios';
import useRoles from '../hooks/useRoles';
import PageBase from '../components/PageBase';
import { api } from '../services/api';

const UsuarioEditar = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { updateUsuario } = useUsuarios();
  const { roles, loading: loadingRoles, loadRoles } = useRoles();
  
  const [formData, setFormData] = useState({
    email: '',
    nombre: '',
    apellido: '',
    rol: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  // Redirigir si no es administrador
  useEffect(() => {
    if (user && user.rol.toLowerCase() !== 'administrador') {
      navigate('/dashboard');
    }
    
    // Cargar roles para el selector
    loadRoles();
    
    // Cargar datos del usuario
    const fetchUsuario = async () => {
      try {
        setLoading(true);
        const data = await api.usuarios.getById(id);
        setFormData({
          email: data.email || '',
          nombre: data.nombre || '',
          apellido: data.apellido || '',
          rol: data.rol || ''
        });
      } catch (error) {
        console.error('Error al cargar usuario:', error);
        setLoadError('No se pudieron obtener los datos del usuario. Verifique su conexión a internet o inténtelo más tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsuario();
  }, [id, user, navigate, loadRoles]);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Limpiar errores al editar
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};
    
    // Validar email
    if (!formData.email) {
      newErrors.email = 'Por favor, ingrese un correo electrónico.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El formato del correo electrónico no es válido. Debe ser similar a: ejemplo@dominio.com';
    }
    
    // Validar nombre
    if (!formData.nombre) {
      newErrors.nombre = 'Por favor, ingrese el nombre del usuario.';
    }
    
    // Validar apellido
    if (!formData.apellido) {
      newErrors.apellido = 'Por favor, ingrese el apellido del usuario.';
    }
    
    // Validar rol
    if (!formData.rol) {
      newErrors.rol = 'Por favor, seleccione un rol para el usuario.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      await updateUsuario(id, formData);
      navigate('/usuarios');
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      setSubmitError(
        error.message || 'Ha ocurrido un problema al intentar actualizar el usuario. Por favor, verifique que los datos sean correctos y que el correo no esté siendo usado por otro usuario.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <PageBase title="Editar Usuario">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="ml-3 text-gray-500">Cargando información del usuario...</p>
        </div>
      </PageBase>
    );
  }

  if (loadError) {
    return (
      <PageBase title="Editar Usuario">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700">{loadError}</p>
          <button
            onClick={() => navigate('/usuarios')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Volver a la lista de usuarios
          </button>
        </div>
      </PageBase>
    );
  }

  return (
    <PageBase 
      title={`Editar Usuario: ${formData.nombre} ${formData.apellido}`} 
      subtitle="Modificar información del usuario"
    >
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="p-6">
          {submitError && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
              <p>{submitError}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div className="col-span-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
              
              {/* Nombre */}
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.nombre ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
                {errors.nombre && (
                  <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
                )}
              </div>
              
              {/* Apellido */}
              <div>
                <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 mb-1">
                  Apellido *
                </label>
                <input
                  type="text"
                  id="apellido"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.apellido ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
                {errors.apellido && (
                  <p className="mt-1 text-sm text-red-600">{errors.apellido}</p>
                )}
              </div>
              
              {/* Rol */}
              <div className="col-span-2">
                <label htmlFor="rol" className="block text-sm font-medium text-gray-700 mb-1">
                  Rol *
                </label>
                <select
                  id="rol"
                  name="rol"
                  value={formData.rol}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.rol ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  disabled={loadingRoles}
                >
                  <option value="">Seleccione un rol</option>
                  {roles && roles.map((rol) => (
                    <option key={rol.id} value={rol.id}>
                      {rol.nombre}
                    </option>
                  ))}
                </select>
                {errors.rol && (
                  <p className="mt-1 text-sm text-red-600">{errors.rol}</p>
                )}
              </div>
            </div>
            
            <div className="mt-8 flex items-center justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/usuarios')}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </PageBase>
  );
};

export default UsuarioEditar; 