import React from 'react';
import PageBase from '../components/PageBase';
import { useAuth } from '../contexts/AuthContext';

const Calificaciones = () => {
  const { user } = useAuth();
  
  // Simulación de datos de calificaciones
  const calificaciones = [
    { id: 1, estudiante: 'Ana María Gómez', asignatura: 'Matemáticas', periodo: 'Primer Periodo', nota: 4.5 },
    { id: 2, estudiante: 'Carlos Pérez', asignatura: 'Matemáticas', periodo: 'Primer Periodo', nota: 3.8 },
    { id: 3, estudiante: 'Luisa Martínez', asignatura: 'Matemáticas', periodo: 'Primer Periodo', nota: 4.2 },
    { id: 4, estudiante: 'Miguel Rodríguez', asignatura: 'Matemáticas', periodo: 'Primer Periodo', nota: 3.5 },
    { id: 5, estudiante: 'Sofía Hernández', asignatura: 'Matemáticas', periodo: 'Primer Periodo', nota: 4.7 },
  ];

  // Datos para filtros
  const asignaturas = ['Matemáticas', 'Español', 'Ciencias', 'Sociales', 'Inglés'];
  const periodos = ['Primer Periodo', 'Segundo Periodo', 'Tercer Periodo', 'Cuarto Periodo'];
  const grupos = ['8A', '8B', '9A', '9B', '10A', '10B'];

  return (
    <PageBase 
      title="Gestión de Calificaciones" 
      subtitle="Registro y consulta de calificaciones por estudiante, grupo y período"
    >
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between flex-wrap">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Calificaciones
          </h3>
          
          {/* Filtros */}
          <div className="flex flex-wrap gap-4">
            <div>
              <label htmlFor="grupo" className="block text-sm font-medium text-gray-700">Grupo</label>
              <select
                id="grupo"
                name="grupo"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">Todos</option>
                {grupos.map(grupo => (
                  <option key={grupo} value={grupo}>{grupo}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="asignatura" className="block text-sm font-medium text-gray-700">Asignatura</label>
              <select
                id="asignatura"
                name="asignatura"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">Todas</option>
                {asignaturas.map(asignatura => (
                  <option key={asignatura} value={asignatura}>{asignatura}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="periodo" className="block text-sm font-medium text-gray-700">Período</label>
              <select
                id="periodo"
                name="periodo"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                {periodos.map(periodo => (
                  <option key={periodo} value={periodo}>{periodo}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Tabla de calificaciones */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estudiante
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Asignatura
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Período
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nota
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {calificaciones.map((calificacion) => (
                <tr key={calificacion.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{calificacion.estudiante}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{calificacion.asignatura}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{calificacion.periodo}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-semibold ${
                      calificacion.nota >= 3.5 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {calificacion.nota.toFixed(1)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {(user.rol === 'administrador' || user.rol === 'docente') && (
                      <>
                        <button className="text-blue-600 hover:text-blue-900 mr-2">Editar</button>
                        <button className="text-red-600 hover:text-red-900">Eliminar</button>
                      </>
                    )}
                    {(user.rol === 'estudiante' || user.rol === 'acudiente') && (
                      <button className="text-blue-600 hover:text-blue-900">Ver Detalles</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Botones de acción */}
        {(user.rol === 'administrador' || user.rol === 'docente') && (
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <button
              type="button"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Registrar Calificación
            </button>
          </div>
        )}
      </div>
      
      {/* Panel de estadísticas */}
      {(user.rol === 'administrador' || user.rol === 'docente') && (
        <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Estadísticas
            </h3>
          </div>
          <div className="border-t border-gray-200">
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <div className="text-sm font-medium text-gray-500">Promedio del grupo</div>
              <div className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">4.1</div>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <div className="text-sm font-medium text-gray-500">Estudiantes aprobados</div>
              <div className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">85%</div>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <div className="text-sm font-medium text-gray-500">Mejor nota</div>
              <div className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">5.0</div>
            </div>
          </div>
        </div>
      )}
    </PageBase>
  );
};

export default Calificaciones; 