import React from 'react';
import PageBase from '../components/PageBase';
import { useAuth } from '../contexts/AuthContext';

const Observador = () => {
  const { user } = useAuth();
  
  // Simulación de datos de observaciones
  const observaciones = [
    { 
      id: 1, 
      estudiante: 'Ana María Gómez', 
      tipo: 'Académica', 
      fecha: '2025-03-15', 
      descripcion: 'Excelente desempeño en el proyecto final de ciencias', 
      registrada_por: 'Prof. Juan Pérez'
    },
    { 
      id: 2, 
      estudiante: 'Carlos Pérez', 
      tipo: 'Disciplinaria', 
      fecha: '2025-03-20', 
      descripcion: 'Llegó tarde a clase sin justificación', 
      registrada_por: 'Prof. María López'
    },
    { 
      id: 3, 
      estudiante: 'Luisa Martínez', 
      tipo: 'Académica', 
      fecha: '2025-03-22', 
      descripcion: 'Ha mejorado significativamente en matemáticas', 
      registrada_por: 'Prof. Carlos Rodríguez'
    },
    { 
      id: 4, 
      estudiante: 'Miguel Rodríguez', 
      tipo: 'Disciplinaria', 
      fecha: '2025-03-25', 
      descripcion: 'Incidente durante el recreo, discusión con un compañero', 
      registrada_por: 'Prof. Ana Torres'
    },
    { 
      id: 5, 
      estudiante: 'Sofía Hernández', 
      tipo: 'Académica', 
      fecha: '2025-03-28', 
      descripcion: 'Participación destacada en clase de literatura', 
      registrada_por: 'Prof. Juan Pérez'
    },
  ];

  // Datos para filtros
  const estudiantes = ['Ana María Gómez', 'Carlos Pérez', 'Luisa Martínez', 'Miguel Rodríguez', 'Sofía Hernández'];
  const tiposObservacion = ['Académica', 'Disciplinaria', 'Comportamental', 'Orientación'];
  const grupos = ['8A', '8B', '9A', '9B', '10A', '10B'];

  return (
    <PageBase 
      title="Observador del Estudiante" 
      subtitle="Registro y consulta de observaciones académicas y disciplinarias"
    >
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between flex-wrap">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Observaciones
          </h3>
          
          {/* Filtros */}
          <div className="flex flex-wrap gap-4">
            <div>
              <label htmlFor="estudiante" className="block text-sm font-medium text-gray-700">Estudiante</label>
              <select
                id="estudiante"
                name="estudiante"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">Todos</option>
                {estudiantes.map(estudiante => (
                  <option key={estudiante} value={estudiante}>{estudiante}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="tipo" className="block text-sm font-medium text-gray-700">Tipo</label>
              <select
                id="tipo"
                name="tipo"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">Todos</option>
                {tiposObservacion.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
            </div>

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
          </div>
        </div>
        
        {/* Lista de observaciones */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estudiante
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descripción
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registrada por
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {observaciones.map((observacion) => (
                <tr key={observacion.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{observacion.estudiante}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      observacion.tipo === 'Académica' ? 'bg-green-100 text-green-800' : 
                      observacion.tipo === 'Disciplinaria' ? 'bg-red-100 text-red-800' : 
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {observacion.tipo}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{observacion.fecha}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">{observacion.descripcion}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{observacion.registrada_por}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-2">Ver</button>
                    {(user.rol === 'administrador' || user.rol === 'docente') && (
                      <>
                        <button className="text-blue-600 hover:text-blue-900 mr-2">Editar</button>
                        <button className="text-red-600 hover:text-red-900">Eliminar</button>
                      </>
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
              Nueva Observación
            </button>
          </div>
        )}
      </div>
    </PageBase>
  );
};

export default Observador; 