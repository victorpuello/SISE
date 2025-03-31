import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usuariosService } from '../../services/usuariosService';
import Swal from 'sweetalert2';
import PageHeader from '../../components/PageHeader';
import { 
  FaUserPlus, 
  FaEdit, 
  FaEye, 
  FaTrash, 
  FaSearch, 
  FaFilter, 
  FaChevronLeft, 
  FaChevronRight,
  FaSync
} from 'react-icons/fa';

const UsuariosList = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    rol: '',
    activo: ''
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const navigate = useNavigate();

  // Roles disponibles
  const roles = [
    { value: '', label: 'Todos los roles' },
    { value: 'Administrador', label: 'Administrador' },
    { value: 'Docente', label: 'Docente' },
    { value: 'Estudiante', label: 'Estudiante' },
    { value: 'Acudiente', label: 'Acudiente' },
    { value: 'Coordinador', label: 'Coordinador' }
  ];

  // Estados disponibles
  const estados = [
    { value: '', label: 'Todos los estados' },
    { value: 'true', label: 'Activo' },
    { value: 'false', label: 'Inactivo' }
  ];

  // Cargar usuarios
  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Crear objeto de filtros
      const queryParams = { ...filters };
      
      // Agregar búsqueda si existe
      if (searchTerm) {
        queryParams.search = searchTerm;
      }
      
      const data = await usuariosService.getUsuarios(currentPage, queryParams);
      setUsuarios(data.results || []);
      setTotalPages(Math.ceil((data.count || 0) / 10)); // Asumiendo 10 items por página
      setLoading(false);
    } catch (err) {
      setError('Error al cargar los usuarios. Por favor, intente nuevamente.');
      setLoading(false);
      console.error('Error al cargar usuarios:', err);
    }
  };

  // Cargar usuarios al montar el componente y cuando cambian los filtros o la página
  useEffect(() => {
    fetchUsuarios();
  }, [currentPage, filters]);

  // Manejar el cambio de página
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Manejar la búsqueda
  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsuarios();
  };

  // Manejar cambios en los filtros
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Resetear filtros
  const resetFilters = () => {
    setFilters({
      rol: '',
      activo: ''
    });
    setSearchTerm('');
  };

  // Eliminar usuario
  const handleDelete = (id, nombre) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar al usuario ${nombre}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
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
          fetchUsuarios(); // Recargar la lista
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

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Gestión de Usuarios" 
        description="Administra los usuarios del sistema"
        actions={
          <Link
            to="/usuarios/nuevo"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FaUserPlus className="mr-2" /> Nuevo Usuario
          </Link>
        }
      />

      {/* Panel de búsqueda y filtros */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-4 sm:p-6">
          <div className="md:flex md:items-center md:justify-between">
            {/* Búsqueda */}
            <div className="relative flex-1 min-w-0 max-w-lg">
              <form onSubmit={handleSearch} className="flex items-center">
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="pl-10 pr-4 py-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm border-gray-300 rounded-md"
                    placeholder="Buscar por nombre o correo"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Buscar
                </button>
              </form>
            </div>

            {/* Botones de filtro */}
            <div className="mt-4 md:mt-0 flex">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FaFilter className="mr-2" /> Filtros
              </button>
              <button
                onClick={resetFilters}
                className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FaSync className="mr-2" /> Resetear
              </button>
            </div>
          </div>

          {/* Panel de filtros */}
          {isFilterOpen && (
            <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="rol" className="block text-sm font-medium text-gray-700">
                    Rol
                  </label>
                  <select
                    id="rol"
                    name="rol"
                    value={filters.rol}
                    onChange={handleFilterChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    {roles.map((rol) => (
                      <option key={rol.value} value={rol.value}>
                        {rol.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="activo" className="block text-sm font-medium text-gray-700">
                    Estado
                  </label>
                  <select
                    id="activo"
                    name="activo"
                    value={filters.activo}
                    onChange={handleFilterChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    {estados.map((estado) => (
                      <option key={estado.value} value={estado.value}>
                        {estado.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tabla de usuarios */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              <p className="ml-3 text-gray-600">Cargando usuarios...</p>
            </div>
          ) : error ? (
            <div className="p-6 text-center">
              <div className="text-red-500 mb-4 text-lg">
                <svg className="h-10 w-10 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>{error}</p>
              </div>
              <button
                onClick={fetchUsuarios}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FaSync className="mr-2" /> Reintentar
              </button>
            </div>
          ) : usuarios.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No se encontraron usuarios que coincidan con los criterios de búsqueda.
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rol
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {usuarios.map((usuario) => (
                  <tr key={usuario.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-medium">
                          {usuario.nombre ? usuario.nombre.charAt(0) : ''}{usuario.apellido ? usuario.apellido.charAt(0) : ''}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {usuario.nombre} {usuario.apellido}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{usuario.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {usuario.rol}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {usuario.activo ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Activo
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Inactivo
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex space-x-2 justify-center">
                        <Link
                          to={`/usuarios/${usuario.id}`}
                          className="text-blue-600 hover:text-blue-900"
                          title="Ver detalles"
                        >
                          <FaEye className="h-5 w-5" />
                        </Link>
                        <Link
                          to={`/usuarios/${usuario.id}/editar`}
                          className="text-amber-600 hover:text-amber-900"
                          title="Editar usuario"
                        >
                          <FaEdit className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(usuario.id, `${usuario.nombre} ${usuario.apellido}`)}
                          className="text-red-600 hover:text-red-900"
                          title="Eliminar usuario"
                        >
                          <FaTrash className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Paginación */}
        {!loading && !error && totalPages > 0 && (
          <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Anterior
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Siguiente
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Mostrando página <span className="font-medium">{currentPage}</span> de{' '}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === 1
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Anterior</span>
                    <FaChevronLeft className="h-5 w-5" />
                  </button>
                  
                  {/* Paginación dinámica */}
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    // Mostrar solo algunas páginas para no sobrecargar la UI
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`relative inline-flex items-center px-4 py-2 border ${
                            currentPage === pageNumber
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          } text-sm font-medium`}
                        >
                          {pageNumber}
                        </button>
                      );
                    } else if (
                      (pageNumber === currentPage - 2 && currentPage > 3) ||
                      (pageNumber === currentPage + 2 && currentPage < totalPages - 2)
                    ) {
                      return (
                        <span
                          key={pageNumber}
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-gray-700 text-sm font-medium"
                        >
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === totalPages
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Siguiente</span>
                    <FaChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsuariosList; 