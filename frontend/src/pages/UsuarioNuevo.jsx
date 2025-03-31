import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import useUsuarios from '../hooks/useUsuarios';
import useRoles from '../hooks/useRoles';
import PageBase from '../components/PageBase';

const UsuarioNuevo = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createUsuario } = useUsuarios();
  const { roles, loading: loadingRoles, loadRoles } = useRoles();
  
  const [formData, setFormData] = useState({
    email: '',
    nombre: '',
    apellido: '',
    rol: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Redirigir si no es administrador
  useEffect(() => {
    if (user && user.rol.toLowerCase() !== 'administrador') {
      navigate('/dashboard');
    }
    
    // Cargar roles para el selector
    loadRoles();
  }, [user, navigate, loadRoles]);

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
    
    // Validar contraseña
    if (!formData.password) {
      newErrors.password = 'Por favor, ingrese una contraseña.';
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
      // Crear objeto de usuario sin confirmPassword
      const userData = {
        email: formData.email,
        nombre: formData.nombre,
        apellido: formData.apellido,
        rol: formData.rol,
        password: formData.password
      };
      
      await createUsuario(userData);
      navigate('/usuarios');
    } catch (error) {
      console.error('Error al crear usuario:', error);
      setSubmitError(
        error.message || 'Ha ocurrido un problema al intentar crear el usuario. Por favor, verifique que los datos sean correctos y que el correo no esté ya registrado.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageBase 
      title="Crear Nuevo Usuario" 
      subtitle="Añadir un nuevo usuario al sistema"
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
                  placeholder="correo@ejemplo.com"
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
              
              {/* Contraseña */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña *
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
                  Confirmar Contraseña *
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
                {isSubmitting ? 'Guardando...' : 'Guardar Usuario'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </PageBase>
  );
};

export default UsuarioNuevo; 