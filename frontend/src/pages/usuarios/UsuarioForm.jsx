import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { usuariosService } from '../../services/usuariosService';
import Swal from 'sweetalert2';
import PageHeader from '../../components/PageHeader';
import { FaSave, FaTimes, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';

const UsuarioForm = () => {
  // Obtener id de la URL si existe (para edición)
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    rol: 'Estudiante',
    activo: true,
    password: '',
    password_confirmation: ''
  });
  
  // Estado para controlar la carga y errores
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [loadError, setLoadError] = useState(null);

  // Roles disponibles
  const roles = [
    { value: 'Administrador', label: 'Administrador' },
    { value: 'Docente', label: 'Docente' },
    { value: 'Estudiante', label: 'Estudiante' },
    { value: 'Acudiente', label: 'Acudiente' },
    { value: 'Coordinador', label: 'Coordinador' }
  ];

  // Cargar datos del usuario si estamos en modo edición
  useEffect(() => {
    if (isEditMode) {
      const fetchUsuario = async () => {
        try {
          setLoading(true);
          const data = await usuariosService.getUsuario(id);
          
          // No mostrar contraseña en modo edición
          const { password, ...userData } = data;
          
          setFormData({
            ...userData,
            password: '',
            password_confirmation: ''
          });
          setLoading(false);
        } catch (error) {
          setLoadError('No se pudo cargar la información del usuario. Por favor, intente nuevamente.');
          setLoading(false);
          console.error('Error al cargar usuario:', error);
        }
      };

      fetchUsuario();
    }
  }, [id, isEditMode]);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: val
    }));
    
    // Limpiar el error de este campo si existe
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Validar el formulario
  const validateForm = () => {
    const newErrors = {};
    
    // Validar nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }
    
    // Validar apellido
    if (!formData.apellido.trim()) {
      newErrors.apellido = 'El apellido es obligatorio';
    }
    
    // Validar email con regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Por favor, ingrese un correo electrónico válido';
    }
    
    // Validar rol
    if (!formData.rol) {
      newErrors.rol = 'El rol es obligatorio';
    }
    
    // Validar contraseña solo para nuevo usuario o si se proporciona en edición
    if (!isEditMode || formData.password) {
      if (!isEditMode && !formData.password) {
        newErrors.password = 'La contraseña es obligatoria para nuevos usuarios';
      } else if (formData.password && formData.password.length < 8) {
        newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
      }
      
      if (formData.password !== formData.password_confirmation) {
        newErrors.password_confirmation = 'Las contraseñas no coinciden';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Mostrar alerta de error
      Swal.fire({
        title: 'Error',
        text: 'Por favor, corrija los errores en el formulario antes de continuar',
        icon: 'error',
        confirmButtonColor: '#3085d6'
      });
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Crear copia de los datos para enviar (omitir password_confirmation)
      const { password_confirmation, ...dataToSend } = formData;
      
      // Si estamos editando y no se proporciona contraseña, omitirla
      if (isEditMode && !dataToSend.password) {
        delete dataToSend.password;
      }
      
      let result;
      if (isEditMode) {
        result = await usuariosService.updateUsuario(id, dataToSend);
      } else {
        result = await usuariosService.createUsuario(dataToSend);
      }
      
      Swal.fire({
        title: '¡Éxito!',
        text: isEditMode 
          ? 'Usuario actualizado correctamente' 
          : 'Usuario creado correctamente',
        icon: 'success',
        confirmButtonColor: '#3085d6'
      }).then(() => {
        navigate('/usuarios');
      });
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      
      // Manejar errores de validación del backend
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Ocurrió un error al procesar la solicitud. Por favor, intente nuevamente.',
          icon: 'error',
          confirmButtonColor: '#3085d6'
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-3 text-gray-600">Cargando información del usuario...</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <FaExclamationTriangle className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{loadError}</p>
            <div className="mt-4">
              <Link
                to="/usuarios"
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Volver al listado
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEditMode ? 'Editar Usuario' : 'Crear Usuario'}
        description={isEditMode 
          ? 'Modifica la información del usuario' 
          : 'Completa el formulario para crear un nuevo usuario'
        }
      />
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre */}
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className={`mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                  errors.nombre ? 'border-red-300' : ''
                }`}
              />
              {errors.nombre && (
                <p className="mt-2 text-sm text-red-600">{errors.nombre}</p>
              )}
            </div>
            
            {/* Apellido */}
            <div>
              <label htmlFor="apellido" className="block text-sm font-medium text-gray-700">
                Apellido <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="apellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                className={`mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                  errors.apellido ? 'border-red-300' : ''
                }`}
              />
              {errors.apellido && (
                <p className="mt-2 text-sm text-red-600">{errors.apellido}</p>
              )}
            </div>
            
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Correo Electrónico <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                  errors.email ? 'border-red-300' : ''
                }`}
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
            
            {/* Rol */}
            <div>
              <label htmlFor="rol" className="block text-sm font-medium text-gray-700">
                Rol <span className="text-red-500">*</span>
              </label>
              <select
                id="rol"
                name="rol"
                value={formData.rol}
                onChange={handleChange}
                className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md ${
                  errors.rol ? 'border-red-300' : ''
                }`}
              >
                {roles.map((rol) => (
                  <option key={rol.value} value={rol.value}>
                    {rol.label}
                  </option>
                ))}
              </select>
              {errors.rol && (
                <p className="mt-2 text-sm text-red-600">{errors.rol}</p>
              )}
            </div>
            
            {/* Estado (activo/inactivo) */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center">
                <input
                  id="activo"
                  name="activo"
                  type="checkbox"
                  checked={formData.activo}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="activo" className="ml-2 block text-sm text-gray-900">
                  Usuario activo
                </label>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Los usuarios inactivos no podrán iniciar sesión en el sistema
              </p>
            </div>
            
            {/* Contraseña */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña {!isEditMode && <span className="text-red-500">*</span>}
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                  errors.password ? 'border-red-300' : ''
                }`}
              />
              {isEditMode && (
                <p className="mt-1 text-sm text-gray-500">
                  Dejar en blanco para mantener la contraseña actual
                </p>
              )}
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
            
            {/* Confirmar Contraseña */}
            <div>
              <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                Confirmar Contraseña {!isEditMode && <span className="text-red-500">*</span>}
              </label>
              <input
                type="password"
                id="password_confirmation"
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleChange}
                className={`mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                  errors.password_confirmation ? 'border-red-300' : ''
                }`}
              />
              {errors.password_confirmation && (
                <p className="mt-2 text-sm text-red-600">{errors.password_confirmation}</p>
              )}
            </div>
          </div>
          
          {/* Botones de acción */}
          <div className="flex justify-end pt-5 border-t border-gray-200 mt-8">
            <Link
              to="/usuarios"
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FaTimes className="mr-2 h-5 w-5 text-gray-400" />
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <FaSpinner className="animate-spin mr-2 h-5 w-5 text-white" />
                  {isEditMode ? 'Guardando...' : 'Creando...'}
                </>
              ) : (
                <>
                  <FaSave className="mr-2 h-5 w-5 text-white" />
                  {isEditMode ? 'Guardar Cambios' : 'Crear Usuario'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UsuarioForm; 