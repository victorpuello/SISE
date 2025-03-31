import React from 'react';
import PageBase from '../components/PageBase';
import { useAuth } from '../contexts/AuthContext';
import { 
  DocumentTextIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon 
} from '@heroicons/react/24/outline';

const Planeaciones = () => {
  const { user } = useAuth();
  
  // Simulación de datos de planeaciones
  const planeaciones = [
    { 
      id: 1, 
      asignatura: 'Matemáticas', 
      grupo: '9A', 
      fecha: '2025-04-05', 
      tema: 'Ecuaciones lineales', 
      estado: 'Aprobado' 
    },
    { 
      id: 2, 
      asignatura: 'Español', 
      grupo: '8B', 
      fecha: '2025-04-06', 
      tema: 'Análisis literario', 
      estado: 'Enviado' 
    },
    { 
      id: 3, 
      asignatura: 'Ciencias', 
      grupo: '10A', 
      fecha: '2025-04-07', 
      tema: 'Sistema digestivo', 
      estado: 'Borrador' 
    },
    { 
      id: 4, 
      asignatura: 'Matemáticas', 
      grupo: '9B', 
      fecha: '2025-04-08', 
      tema: 'Funciones cuadráticas', 
      estado: 'Enviado' 
    },
    { 
      id: 5, 
      asignatura: 'Sociales', 
      grupo: '8A', 
      fecha: '2025-04-09', 
      tema: 'Revolución francesa', 
      estado: 'Aprobado' 
    },
  ];

  // Datos para filtros
  const asignaturas = ['Matemáticas', 'Español', 'Ciencias', 'Sociales', 'Inglés'];
  const grupos = ['8A', '8B', '9A', '9B', '10A', '10B'];
  const estados = ['Borrador', 'Enviado', 'Aprobado'];

  // Estado de la planeación con su respectivo color e icono
  const getEstadoInfo = (estado) => {
    switch(estado) {
      case 'Aprobado':
        return { 
          icon: <CheckCircleIcon className="h-5 w-5" />, 
          color: 'text-green-600 bg-green-100' 
        };
      case 'Enviado':
        return { 
          icon: <ClockIcon className="h-5 w-5" />, 
          color: 'text-yellow-600 bg-yellow-100' 
        };
      case 'Borrador':
        return { 
          icon: <DocumentTextIcon className="h-5 w-5" />, 
          color: 'text-gray-600 bg-gray-100' 
        };
      default:
        return { 
          icon: <XCircleIcon className="h-5 w-5" />, 
          color: 'text-red-600 bg-red-100' 
        };
    }
  };

  return (
    <PageBase 
      title="Planeaciones de Clase" 
      subtitle="Gestión de planeaciones académicas por asignatura y grupo"
    >
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between flex-wrap">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Planeaciones
          </h3>
          
          {/* Filtros */}
          <div className="flex flex-wrap gap-4">
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
              <label htmlFor="estado" className="block text-sm font-medium text-gray-700">Estado</label>
              <select
                id="estado"
                name="estado"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">Todos</option>
                {estados.map(estado => (
                  <option key={estado} value={estado}>{estado}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Lista de planeaciones */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {planeaciones.map((planeacion) => {
              const estadoInfo = getEstadoInfo(planeacion.estado);
              
              return (
                <li key={planeacion.id}>
                  <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className={`p-2 rounded-md ${estadoInfo.color}`}>
                            {estadoInfo.icon}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-blue-600">{planeacion.tema}</div>
                          <div className="text-sm text-gray-500">
                            {planeacion.asignatura} - {planeacion.grupo}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="text-sm text-gray-900">
                          {planeacion.fecha}
                        </div>
                        <div className={`mt-1 flex items-center text-sm ${
                          planeacion.estado === 'Aprobado' ? 'text-green-600' : 
                          planeacion.estado === 'Enviado' ? 'text-yellow-600' : 
                          'text-gray-500'
                        }`}>
                          <span>{planeacion.estado}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="flex space-x-4">
                        <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                          Ver Detalles
                        </button>
                        {(user.rol === 'administrador' || (user.rol === 'docente' && planeacion.estado !== 'Aprobado')) && (
                          <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                            Editar
                          </button>
                        )}
                        {user.rol === 'administrador' && planeacion.estado === 'Enviado' && (
                          <button className="text-green-600 hover:text-green-900 text-sm font-medium">
                            Aprobar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Botones de acción */}
        {(user.rol === 'administrador' || user.rol === 'docente') && (
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <button
              type="button"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Nueva Planeación
            </button>
          </div>
        )}
      </div>
    </PageBase>
  );
};

export default Planeaciones; 