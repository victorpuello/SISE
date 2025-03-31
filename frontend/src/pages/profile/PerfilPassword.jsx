import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';
import PageHeader from '../../components/PageHeader';
import Swal from 'sweetalert2';

const PerfilPassword = () => {
  const { user, changePassword } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

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
    
    if (!formData.currentPassword) {
      errors.currentPassword = 'La contraseña actual es obligatoria';
    }
    
    if (!formData.newPassword) {
      errors.newPassword = 'La nueva contraseña es obligatoria';
    } else if (formData.newPassword.length < 8) {
      errors.newPassword = 'La contraseña debe tener al menos 8 caracteres';
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Debe confirmar la nueva contraseña';
    } else if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    try {
      await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      
      Swal.fire({
        icon: 'success',
        title: '¡Contraseña actualizada!',
        text: 'Tu contraseña ha sido actualizada correctamente.',
        confirmButtonText: 'Aceptar'
      }).then(() => {
        navigate('/profile');
      });
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      
      let errorMessage = 'No se pudo actualizar la contraseña. Inténtalo de nuevo.';
      if (error.response && error.response.data && error.response.data.detail) {
        errorMessage = error.response.data.detail;
      }
      
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        confirmButtonText: 'Aceptar'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cambiar contraseña"
        description="Actualiza tu contraseña de acceso al sistema"
      />

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          {/* Información de seguridad */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <FaInfoCircle className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  Por seguridad, tu nueva contraseña debe:
                </p>
                <ul className="mt-2 text-sm text-blue-700 list-disc list-inside">
                  <li>Tener al menos 8 caracteres</li>
                  <li>Incluir al menos una letra mayúscula y una minúscula</li>
                  <li>Incluir al menos un número</li>
                  <li>Ser diferente a tu contraseña actual</li>
                </ul>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contraseña actual */}
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                Contraseña actual *
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  name="currentPassword"
                  id="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                    formErrors.currentPassword ? 'border-red-300' : ''
                  }`}
                  placeholder="Ingresa tu contraseña actual"
                />
                {formErrors.currentPassword && (
                  <p className="mt-2 text-sm text-red-600">{formErrors.currentPassword}</p>
                )}
              </div>
            </div>

            {/* Nueva contraseña */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                Nueva contraseña *
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  name="newPassword"
                  id="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                    formErrors.newPassword ? 'border-red-300' : ''
                  }`}
                  placeholder="Mínimo 8 caracteres"
                />
                {formErrors.newPassword && (
                  <p className="mt-2 text-sm text-red-600">{formErrors.newPassword}</p>
                )}
              </div>
            </div>

            {/* Confirmar nueva contraseña */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmar nueva contraseña *
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
                  placeholder="Repite tu nueva contraseña"
                />
                {formErrors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600">{formErrors.confirmPassword}</p>
                )}
              </div>
            </div>

            <div className="pt-5 flex justify-end">
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancelar
              </button>
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
                    Actualizando...
                  </>
                ) : (
                  <>Actualizar contraseña</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PerfilPassword; 