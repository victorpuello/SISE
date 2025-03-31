import React, { useState } from 'react';
import PageBase from '../components/PageBase';
import { useAuth } from '../contexts/AuthContext';
import useAsistencias from '../hooks/useAsistencias';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

const Asistencias = () => {
  const { user } = useAuth();
  const [grupo, setGrupo] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  
  // Usar el hook de asistencias
  const { 
    asistencias, 
    loading, 
    error, 
    updateFilters, 
    createAsistencia,
    updateAsistencia,
    deleteAsistencia 
  } = useAsistencias({ grupo: '', fecha: fecha });

  // Lista de grupos para el filtro
  const grupos = ['8A', '8B', '9A', '9B', '10A', '10B'];

  // Manejar cambios en los filtros
  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    if (name === 'grupo') {
      setGrupo(value);
    } else if (name === 'fecha') {
      setFecha(value);
    }
    
    updateFilters({ [name]: value });
  };

  // Manejar el cambio de estado de una asistencia
  const handleEstadoChange = async (id, nuevoEstado) => {
    if (!user || (user.rol !== 'administrador' && user.rol !== 'docente')) {
      return;
    }
    
    try {
      await updateAsistencia(id, { estado: nuevoEstado });
    } catch (error) {
      console.error('Error al actualizar estado:', error);
    }
  };

  // Manejar eliminación de asistencia
  const handleEliminar = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este registro?')) {
      try {
        await deleteAsistencia(id);
      } catch (error) {
        console.error('Error al eliminar asistencia:', error);
      }
    }
  };

  return (
    <PageBase 
      title="Control de Asistencia" 
      subtitle="Registro y consulta de asistencia por grupo y fecha"
    >
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between flex-wrap">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Asistencias
          </h3>
          
          {/* Filtros */}
          <div className="flex flex-wrap gap-4">
            <div>
              <label htmlFor="grupo" className="block text-sm font-medium text-gray-700">Grupo</label>
              <select
                id="grupo"
                name="grupo"
                value={grupo}
                onChange={handleFiltroChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">Todos</option>
                {grupos.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="fecha" className="block text-sm font-medium text-gray-700">Fecha</label>
              <input
                type="date"
                name="fecha"
                id="fecha"
                value={fecha}
                onChange={handleFiltroChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              />
            </div>
          </div>
        </div>
        
        {/* Mensaje de error */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Estado de carga */}
        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-500">Cargando asistencias...</p>
          </div>
        ) : (
          /* Tabla de asistencias */
          <div className="overflow-x-auto">
            {asistencias.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500">No hay registros de asistencia para los filtros seleccionados.</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estudiante
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grupo
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
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
                  {asistencias.map((asistencia) => (
                    <tr key={asistencia.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{asistencia.estudiante}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{asistencia.grupo}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{asistencia.fecha}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {(user.rol === 'administrador' || user.rol === 'docente') ? (
                          <select
                            value={asistencia.estado}
                            onChange={(e) => handleEstadoChange(asistencia.id, e.target.value)}
                            className={`text-sm font-semibold rounded px-2 py-1 border ${
                              asistencia.estado === 'Presente' ? 'bg-green-100 text-green-800 border-green-300' : 
                              asistencia.estado === 'Ausente' ? 'bg-red-100 text-red-800 border-red-300' : 
                              'bg-yellow-100 text-yellow-800 border-yellow-300'
                            }`}
                          >
                            <option value="Presente">Presente</option>
                            <option value="Ausente">Ausente</option>
                            <option value="Tardanza">Tardanza</option>
                          </select>
                        ) : (
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            asistencia.estado === 'Presente' ? 'bg-green-100 text-green-800' : 
                            asistencia.estado === 'Ausente' ? 'bg-red-100 text-red-800' : 
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {asistencia.estado}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {(user.rol === 'administrador' || user.rol === 'docente') && (
                          <>
                            <button 
                              className="text-red-600 hover:text-red-900"
                              onClick={() => handleEliminar(asistencia.id)}
                            >
                              Eliminar
                            </button>
                          </>
                        )}
                        {(user.rol === 'estudiante' || user.rol === 'acudiente') && (
                          <button className="text-blue-600 hover:text-blue-900">Ver Detalle</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Botones de acción */}
        {(user.rol === 'administrador' || user.rol === 'docente') && (
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <button
              type="button"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => {
                // Aquí iría la lógica para abrir un modal para registrar asistencia
                alert('Funcionalidad para registrar asistencia en desarrollo');
              }}
            >
              Registrar Asistencia
            </button>
          </div>
        )}
      </div>
    </PageBase>
  );
};

export default Asistencias; 