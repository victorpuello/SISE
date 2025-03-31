import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { usuariosService } from '../../services/usuariosService';
import PageHeader from '../../components/PageHeader';
import { 
  FaEdit, 
  FaTrash, 
  FaLock, 
  FaArrowLeft,
  FaExclamationTriangle,
  FaUser,
  FaEnvelope,
  FaIdCard,
  FaToggleOn
} from 'react-icons/fa';
import Swal from 'sweetalert2';

const UsuarioView = () => {
  const { id } = useParams();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Cargar datos del usuario
  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        setLoading(true);
        const data = await usuariosService.getUsuario(id);
        setUsuario(data);
        setLoading(false);
      } catch (error) {
        setError('No se pudo cargar la información del usuario. Por favor, intente nuevamente.');
        setLoading(false);
        console.error('Error al cargar usuario:', error);
      }
    };

    fetchUsuario();
  }, [id]);

  // Función para confirmar y eliminar usuario
  const handleDelete = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar al usuario ${usuario.nombre} ${usuario.apellido}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await usuariosService.deleteUsuario(id);
          Swal.fire(
            '¡Eliminado!',
            'El usuario ha sido eliminado correctamente.',
            'success'
          );
          navigate('/usuarios');
        } catch (error) {
          Swal.fire(
            'Error',
            'No se pudo eliminar el usuario. Inténtalo de nuevo.',
            'error'
          );
          console.error('Error al eliminar usuario:', error);
        }
      }
    });
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
        title="Detalle de Usuario"
        description={`Información de ${usuario.nombre} ${usuario.apellido}`}
        actions={
          <div className="flex space-x-3">
            <Link
              to={`/usuarios/${id}/editar`}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FaEdit className="mr-2" /> Editar
            </Link>
            <button
              onClick={handleDelete}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <FaTrash className="mr-2" /> Eliminar
            </button>
          </div>
        }
      />

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* Información principal del usuario */}
        <div className="p-6">
          <div className="flex items-center mb-6">
            <div className="h-20 w-20 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-2xl font-bold">
              {usuario.nombre.charAt(0)}{usuario.apellido.charAt(0)}
            </div>
            <div className="ml-6">
              <h2 className="text-xl font-semibold text-gray-900">{usuario.nombre} {usuario.apellido}</h2>
              <p className="text-gray-600">{usuario.email}</p>
              <div className="mt-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  usuario.activo 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {usuario.activo ? 'Activo' : 'Inactivo'}
                </span>
                <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {usuario.rol}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Detalles del usuario</h3>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {/* Nombre completo */}
              <div className="bg-gray-50 px-4 py-3 rounded-md">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <FaUser className="mr-2 text-gray-400" /> Nombre Completo
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{usuario.nombre} {usuario.apellido}</dd>
              </div>
              
              {/* Correo electrónico */}
              <div className="bg-gray-50 px-4 py-3 rounded-md">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <FaEnvelope className="mr-2 text-gray-400" /> Correo Electrónico
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{usuario.email}</dd>
              </div>
              
              {/* Rol */}
              <div className="bg-gray-50 px-4 py-3 rounded-md">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <FaIdCard className="mr-2 text-gray-400" /> Rol en el Sistema
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{usuario.rol}</dd>
              </div>
              
              {/* Estado */}
              <div className="bg-gray-50 px-4 py-3 rounded-md">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <FaToggleOn className="mr-2 text-gray-400" /> Estado
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{usuario.activo ? 'Activo' : 'Inactivo'}</dd>
              </div>
              
              {/* Fecha de creación */}
              {usuario.created_at && (
                <div className="bg-gray-50 px-4 py-3 rounded-md">
                  <dt className="text-sm font-medium text-gray-500">Fecha de Registro</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(usuario.created_at).toLocaleDateString()}
                  </dd>
                </div>
              )}
              
              {/* Última actualización */}
              {usuario.updated_at && (
                <div className="bg-gray-50 px-4 py-3 rounded-md">
                  <dt className="text-sm font-medium text-gray-500">Última Actualización</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(usuario.updated_at).toLocaleDateString()}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
          <Link
            to="/usuarios"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FaArrowLeft className="mr-2" /> Volver
          </Link>
          <div className="flex space-x-3">
            <Link
              to={`/usuarios/${id}/cambiar-password`}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
            >
              <FaLock className="mr-2" /> Cambiar Contraseña
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsuarioView; 