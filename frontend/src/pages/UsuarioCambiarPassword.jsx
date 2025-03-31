import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import useUsuarios from '../hooks/useUsuarios';
import PageBase from '../components/PageBase';
import { api } from '../services/api';

const UsuarioCambiarPassword = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { changePassword } = useUsuarios();
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  
  const [userData, setUserData] = useState(null);
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
    
    // Cargar datos básicos del usuario para mostrar nombre
    const fetchUsuario = async () => {
      try {
        setLoading(true);
        const data = await api.usuarios.getById(id);
        setUserData(data);
      } catch (error) {
        console.error('Error al cargar usuario:', error);
        setLoadError('No se pudieron obtener los datos del usuario. Verifique su conexión a internet o inténtelo más tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsuario();
  }, [id, user, navigate]);

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
    
    // Validar contraseña
    if (!formData.password) {
      newErrors.password = 'Por favor, ingrese una nueva contraseña.';
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe contener al menos 8 caracteres por seguridad.';
    }
    
    // Validar confirmación de contraseña
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden. Por favor, verifique que sean idénticas.';
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
      await changePassword(id, formData.password);
      navigate('/usuarios');
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      setSubmitError(
        error.message || 'Ha ocurrido un problema al intentar cambiar la contraseña. Por favor, inténtelo de nuevo más tarde.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <PageBase title="Cambiar Contraseña">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="ml-3 text-gray-500">Cargando información del usuario...</p>
        </div>
      </PageBase>
    );
  }

  if (loadError) {
    return (
      <PageBase title="Cambiar Contraseña">
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
      title={`Cambiar Contraseña: ${userData?.nombre} ${userData?.apellido}`} 
      subtitle="Establecer una nueva contraseña para el usuario"
    >
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="p-6">
          {submitError && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
              <p>{submitError}</p>
            </div>
          )}
          
          <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700">
            <p>
              Está a punto de cambiar la contraseña del usuario <strong>{userData?.email}</strong>.
              Una vez guardada, el usuario deberá utilizar esta nueva contraseña para iniciar sesión en el sistema.
            </p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contraseña */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Nueva Contraseña *
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>
              
              {/* Confirmar Contraseña */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar Nueva Contraseña *
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
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
                {isSubmitting ? 'Guardando...' : 'Cambiar Contraseña'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </PageBase>
  );
};

export default UsuarioCambiarPassword; 