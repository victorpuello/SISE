import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { usuariosService } from '../../services/usuariosService';
import { FaArrowLeft, FaLock, FaExclamationTriangle } from 'react-icons/fa';
import PageHeader from '../../components/PageHeader';
import Swal from 'sweetalert2';

const ChangePassword = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState({});

  // Cargar datos básicos del usuario
  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const data = await usuariosService.getUsuario(id);
        setUsuario(data);
        setLoading(false);
      } catch (error) {
        setError('No se pudo cargar la información del usuario');
        setLoading(false);
        console.error('Error al cargar usuario:', error);
      }
    };

    fetchUsuario();
  }, [id]);

  // Función para actualizar el estado del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar errores al cambiar el valor
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validar formulario
  const validateForm = () => {
    const errors = {};
    
    if (!formData.password) {
      errors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 8) {
      errors.password = 'La contraseña debe tener al menos 8 caracteres';
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Debe confirmar la contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    try {
      await usuariosService.changePassword(id, { password: formData.password });
      
      Swal.fire({
        icon: 'success',
        title: '¡Contraseña actualizada!',
        text: 'La contraseña del usuario ha sido actualizada correctamente.',
        confirmButtonText: 'Aceptar'
      }).then(() => {
        navigate(`/usuarios/${id}`);
      });
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar la contraseña. Inténtalo de nuevo.',
        confirmButtonText: 'Aceptar'
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Mostrar estado de carga
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-3 text-gray-600">Cargando información del usuario...</p>
      </div>
    );
  }

  // Mostrar error
  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <FaExclamationTriangle className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
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

  // No se encontró el usuario
  if (!usuario) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <FaExclamationTriangle className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">No se encontró el usuario solicitado.</p>
            <div className="mt-4">
              <Link
                to="/usuarios"
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
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
        title="Cambiar Contraseña"
        description={`Cambiar contraseña para el usuario ${usuario.nombre} ${usuario.apellido}`}
        actions={
          <Link
            to={`/usuarios/${id}`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FaArrowLeft className="mr-2" /> Volver al detalle
          </Link>
        }
      />

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center mb-6">
            <div className="h-16 w-16 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xl font-bold">
              {usuario.nombre.charAt(0)}{usuario.apellido.charAt(0)}
            </div>
            <div className="ml-6">
              <h2 className="text-xl font-semibold text-gray-900">{usuario.nombre} {usuario.apellido}</h2>
              <p className="text-gray-600">{usuario.email}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FaLock className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    Está a punto de cambiar la contraseña de este usuario. La nueva contraseña debe tener al menos 8 caracteres.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              {/* Contraseña */}
              <div className="sm:col-span-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Nueva Contraseña *
                </label>
                <div className="mt-1">
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      formErrors.password ? 'border-red-300' : ''
                    }`}
                    placeholder="Mínimo 8 caracteres"
                  />
                  {formErrors.password && (
                    <p className="mt-2 text-sm text-red-600">{formErrors.password}</p>
                  )}
                </div>
              </div>

              {/* Confirmar Contraseña */}
              <div className="sm:col-span-1">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirmar Contraseña *
                </label>
                <div className="mt-1">
                  <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      formErrors.confirmPassword ? 'border-red-300' : ''
                    }`}
                    placeholder="Repita la contraseña"
                  />
                  {formErrors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-600">{formErrors.confirmPassword}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-5 flex justify-end">
              <Link
                to={`/usuarios/${id}`}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className={`ml-3 inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  submitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Guardando...
                  </>
                ) : (
                  <>Guardar</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword; 