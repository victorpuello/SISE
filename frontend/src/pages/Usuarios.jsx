import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import useUsuarios from '../hooks/useUsuarios';
import PageBase from '../components/PageBase';
import { 
  PencilIcon, 
  TrashIcon, 
  UserPlusIcon, 
  MagnifyingGlassIcon,
  XCircleIcon,
  CheckCircleIcon,
  KeyIcon
} from '@heroicons/react/24/outline';

const Usuarios = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [rolFilter, setRolFilter] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const { 
    usuarios, 
    loading, 
    error, 
    pagination, 
    loadUsuarios, 
    updateParams,
    deleteUsuario,
    activateUsuario,
    deactivateUsuario 
  } = useUsuarios();

  // Redirigir si no es administrador
  useEffect(() => {
    if (user && user.rol.toLowerCase() !== 'administrador') {
      window.location.href = '/dashboard';
    }
  }, [user]);

  // Manejar búsqueda
  const handleSearch = (e) => {
    e.preventDefault();
    updateParams({ q: searchTerm });
  };

  // Manejar cambio de filtro por rol
  const handleRolFilterChange = (e) => {
    setRolFilter(e.target.value);
    updateParams({ rol: e.target.value || null });
  };

  // Manejar cambio de filtro de estado activo/inactivo
  const handleActiveFilterChange = (e) => {
    const showInactive = e.target.checked;
    setShowInactive(showInactive);
    updateParams({ is_active: showInactive ? null : 'true' });
  };

  // Manejar cambio de página
  const handlePageChange = (page) => {
    loadUsuarios(page);
  };

  // Manejar eliminación de usuario
  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro que desea eliminar este usuario? Esta acción no se puede deshacer y podría afectar datos relacionados.')) {
      await deleteUsuario(id);
    }
  };

  // Manejar activación/desactivación de usuario
  const handleToggleActive = async (id, isActive) => {
    if (isActive) {
      if (window.confirm('¿Está seguro que desea desactivar este usuario? El usuario no podrá acceder al sistema mientras esté desactivado.')) {
        await deactivateUsuario(id);
      }
    } else {
      if (window.confirm('¿Está seguro que desea activar este usuario? El usuario podrá acceder al sistema nuevamente.')) {
        await activateUsuario(id);
      }
    }
  };

  return (
    <PageBase 
      title="Gestión de Usuarios" 
      subtitle="Administre los usuarios del sistema"
    >
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        {/* Filtros y búsqueda */}
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Input de búsqueda */}
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                placeholder="Buscar usuarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <MagnifyingGlassIcon className="w-5 h-5" />
              </button>
            </form>
            
            {/* Filtro por rol */}
            <div>
              <select
                value={rolFilter}
                onChange={handleRolFilterChange}
                className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos los roles</option>
                <option value="administrador">Administrador</option>
                <option value="docente">Docente</option>
                <option value="estudiante">Estudiante</option>
                <option value="acudiente">Acudiente</option>
              </select>
            </div>
            
            {/* Filtro de usuarios activos/inactivos */}
            <div className="flex items-center">
              <input
                id="show-inactive"
                type="checkbox"
                checked={showInactive}
                onChange={handleActiveFilterChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="show-inactive" className="ml-2 block text-sm text-gray-900">
                Mostrar inactivos
              </label>
            </div>
          </div>
          
          {/* Botón de crear usuario */}
          <Link 
            to="/usuarios/nuevo"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
          >
            <UserPlusIcon className="w-5 h-5 mr-2" />
            Nuevo Usuario
          </Link>
        </div>
        
        {/* Tabla de usuarios */}
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-500">Cargando usuarios...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">
            <XCircleIcon className="inline-block w-8 h-8 mb-2" />
            <p>{error}</p>
          </div>
        ) : usuarios.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No se encontraron usuarios que coincidan con los criterios de búsqueda.</p>
            <p className="mt-2 text-sm">Pruebe con otros filtros o cree un nuevo usuario.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Correo Electrónico
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rol
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {usuarios.map((usuario) => (
                  <tr key={usuario.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {usuario.nombre} {usuario.apellido}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{usuario.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {usuario.rol_nombre || usuario.rol}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {usuario.is_active ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Activo
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Inactivo
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link 
                          to={`/usuarios/${usuario.id}/editar`}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Editar"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </Link>
                        <Link 
                          to={`/usuarios/${usuario.id}/cambiar-password`}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Cambiar contraseña"
                        >
                          <KeyIcon className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => handleToggleActive(usuario.id, usuario.is_active)}
                          className={`p-1 ${usuario.is_active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                          title={usuario.is_active ? 'Desactivar' : 'Activar'}
                        >
                          {usuario.is_active ? (
                            <XCircleIcon className="w-5 h-5" />
                          ) : (
                            <CheckCircleIcon className="w-5 h-5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(usuario.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Eliminar"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Paginación */}
        {pagination && pagination.count > 0 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(pagination.current - 1)}
                disabled={!pagination.previous}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  pagination.previous
                    ? 'text-gray-700 bg-white hover:bg-gray-50'
                    : 'text-gray-300 bg-gray-100 cursor-not-allowed'
                }`}
              >
                Anterior
              </button>
              <button
                onClick={() => handlePageChange(pagination.current + 1)}
                disabled={!pagination.next}
                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  pagination.next
                    ? 'text-gray-700 bg-white hover:bg-gray-50'
                    : 'text-gray-300 bg-gray-100 cursor-not-allowed'
                }`}
              >
                Siguiente
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Mostrando <span className="font-medium">{((pagination.current - 1) * pagination.pageSize) + 1}</span> a{' '}
                  <span className="font-medium">
                    {Math.min(pagination.current * pagination.pageSize, pagination.count)}
                  </span>{' '}
                  de <span className="font-medium">{pagination.count}</span> resultados
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(pagination.current - 1)}
                    disabled={!pagination.previous}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                      pagination.previous
                        ? 'text-gray-500 bg-white hover:bg-gray-50'
                        : 'text-gray-300 bg-gray-100 cursor-not-allowed'
                    }`}
                  >
                    <span className="sr-only">Anterior</span>
                    &larr;
                  </button>
                  
                  {/* Páginas */}
                  {Array.from({ length: Math.ceil(pagination.count / pagination.pageSize) }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handlePageChange(index + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border ${
                        pagination.current === index + 1
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      } text-sm font-medium`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(pagination.current + 1)}
                    disabled={!pagination.next}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                      pagination.next
                        ? 'text-gray-500 bg-white hover:bg-gray-50'
                        : 'text-gray-300 bg-gray-100 cursor-not-allowed'
                    }`}
                  >
                    <span className="sr-only">Siguiente</span>
                    &rarr;
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageBase>
  );
};

export default Usuarios; 