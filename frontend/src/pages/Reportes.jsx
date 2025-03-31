import React, { useState } from 'react';
import PageBase from '../components/PageBase';
import { useAuth } from '../contexts/AuthContext';

const Reportes = () => {
  const { user } = useAuth();
  const [reporteSeleccionado, setReporteSeleccionado] = useState('rendimiento');
  
  // Simulación de datos para gráficos
  const datosRendimiento = {
    labels: ['Matemáticas', 'Español', 'Ciencias', 'Sociales', 'Inglés'],
    datasets: [
      {
        promedios: [3.8, 4.2, 3.9, 4.5, 3.7],
        maximos: [5.0, 5.0, 5.0, 5.0, 5.0],
        minimos: [2.5, 3.0, 2.8, 3.2, 2.6]
      }
    ]
  };
  
  const datosAsistencia = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
    porcentajes: [95, 92, 88, 94, 97]
  };
  
  const estadisticasObservador = {
    academicas: 24,
    disciplinarias: 8,
    comportamentales: 12,
    orientacion: 5
  };
  
  const datosComparativos = {
    periodos: ['Primer Periodo', 'Segundo Periodo', 'Tercer Periodo'],
    curso8A: [3.8, 4.1, 4.3],
    curso8B: [3.6, 3.9, 4.0],
    curso9A: [4.2, 4.0, 4.5]
  };

  // Lista de reportes disponibles según rol
  const reportesDisponibles = () => {
    const reportes = [
      { id: 'rendimiento', nombre: 'Rendimiento Académico', disponiblePara: ['administrador', 'docente', 'estudiante', 'acudiente'] },
      { id: 'asistencia', nombre: 'Asistencia', disponiblePara: ['administrador', 'docente', 'estudiante', 'acudiente'] },
      { id: 'observador', nombre: 'Observador del Estudiante', disponiblePara: ['administrador', 'docente', 'acudiente'] },
      { id: 'comparativo', nombre: 'Comparativo entre Cursos', disponiblePara: ['administrador', 'docente'] },
      { id: 'avance', nombre: 'Avance de Planeaciones', disponiblePara: ['administrador', 'docente'] }
    ];
    
    return reportes.filter(reporte => reporte.disponiblePara.includes(user.rol));
  };

  // Renderiza el contenido del reporte seleccionado
  const renderReporteSeleccionado = () => {
    switch (reporteSeleccionado) {
      case 'rendimiento':
        return (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Rendimiento Académico por Asignatura</h3>
            
            {/* Simulación de gráfico de barras */}
            <div className="h-64 border border-gray-200 rounded-lg p-4 mb-4">
              <div className="flex h-full items-end space-x-4">
                {datosRendimiento.labels.map((label, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div className="relative w-full flex flex-col items-center">
                      {/* Barra de promedio */}
                      <div 
                        className="w-12 bg-blue-500 rounded-t"
                        style={{ height: `${datosRendimiento.datasets[0].promedios[index] * 40}px` }}
                      ></div>
                      {/* Marcador de máximo */}
                      <div className="absolute w-14 h-0.5 bg-red-500" style={{ bottom: `${datosRendimiento.datasets[0].maximos[index] * 40}px` }}></div>
                      {/* Marcador de mínimo */}
                      <div className="absolute w-14 h-0.5 bg-green-500" style={{ bottom: `${datosRendimiento.datasets[0].minimos[index] * 40}px` }}></div>
                    </div>
                    <span className="text-xs font-medium text-gray-700 mt-2">{label}</span>
                    <span className="text-xs text-gray-500">{datosRendimiento.datasets[0].promedios[index]}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-500 mr-2"></div>
                  <span className="text-sm text-gray-700">Promedio</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-500 mr-2"></div>
                  <span className="text-sm text-gray-700">Máximo</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 mr-2"></div>
                  <span className="text-sm text-gray-700">Mínimo</span>
                </div>
              </div>
              
              <button
                type="button"
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                Exportar PDF
              </button>
            </div>
          </div>
        );
        
      case 'asistencia':
        return (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Reporte de Asistencia</h3>
            
            {/* Simulación de gráfico de línea */}
            <div className="h-64 border border-gray-200 rounded-lg p-4 mb-4">
              <div className="h-full flex flex-col justify-between">
                <div className="flex justify-between items-end h-full relative">
                  {datosAsistencia.labels.map((mes, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div 
                        className="w-4 h-4 rounded-full bg-blue-500 z-10"
                        style={{ marginBottom: `${datosAsistencia.porcentajes[index] * 2}px` }}
                      ></div>
                      <span className="text-xs text-gray-700 mt-2">{mes}</span>
                    </div>
                  ))}
                  
                  {/* Línea de tendencia (simulada) */}
                  <div className="absolute bottom-0 left-0 right-0 h-full">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <polyline
                        points="10,10 30,16 50,24 70,12 90,6"
                        className="stroke-blue-500 stroke-2 fill-none"
                      />
                    </svg>
                  </div>
                </div>
                
                <div className="flex justify-between border-t border-gray-200 pt-2">
                  {datosAsistencia.porcentajes.map((porcentaje, index) => (
                    <div key={index} className="text-xs text-gray-700 text-center">
                      {porcentaje}%
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-between mt-4">
              <div className="text-sm text-gray-700">
                <span className="font-medium">Promedio de asistencia:</span> 93.2%
              </div>
              <button
                type="button"
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                Exportar PDF
              </button>
            </div>
          </div>
        );
        
      case 'observador':
        return (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Estadísticas del Observador</h3>
            
            {/* Simulación de gráfico circular */}
            <div className="h-64 flex justify-center items-center border border-gray-200 rounded-lg p-4 mb-4">
              <div className="w-48 h-48 rounded-full border-8 border-blue-500 relative flex items-center justify-center">
                <div className="absolute w-full h-full">
                  <div className="absolute w-1/2 h-1/2 top-0 left-0 border-r-8 border-b-8 border-red-500 rounded-tr-full"></div>
                  <div className="absolute w-1/4 h-1/2 top-0 right-0 border-l-8 border-b-8 border-green-500 rounded-tl-full"></div>
                  <div className="absolute w-1/4 h-1/2 bottom-0 right-0 border-l-8 border-t-8 border-yellow-500 rounded-bl-full"></div>
                </div>
                <div className="text-2xl font-bold text-gray-700">
                  {estadisticasObservador.academicas + estadisticasObservador.disciplinarias + estadisticasObservador.comportamentales + estadisticasObservador.orientacion}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 mr-2"></div>
                <div>
                  <div className="text-sm font-medium text-gray-700">Académicas</div>
                  <div className="text-lg font-semibold">{estadisticasObservador.academicas}</div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 mr-2"></div>
                <div>
                  <div className="text-sm font-medium text-gray-700">Disciplinarias</div>
                  <div className="text-lg font-semibold">{estadisticasObservador.disciplinarias}</div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 mr-2"></div>
                <div>
                  <div className="text-sm font-medium text-gray-700">Comportamentales</div>
                  <div className="text-lg font-semibold">{estadisticasObservador.comportamentales}</div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-500 mr-2"></div>
                <div>
                  <div className="text-sm font-medium text-gray-700">Orientación</div>
                  <div className="text-lg font-semibold">{estadisticasObservador.orientacion}</div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'comparativo':
        return (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Comparativo entre Cursos</h3>
            
            {/* Simulación de gráfico de barras agrupadas */}
            <div className="h-64 border border-gray-200 rounded-lg p-4 mb-4">
              <div className="flex h-full items-end space-x-8">
                {datosComparativos.periodos.map((periodo, index) => (
                  <div key={index} className="flex space-x-2 items-end flex-1">
                    <div className="flex flex-col items-center">
                      <div 
                        className="w-8 bg-blue-500 rounded-t"
                        style={{ height: `${datosComparativos.curso8A[index] * 35}px` }}
                      ></div>
                      <span className="text-xs text-gray-500 mt-1">{datosComparativos.curso8A[index]}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div 
                        className="w-8 bg-green-500 rounded-t"
                        style={{ height: `${datosComparativos.curso8B[index] * 35}px` }}
                      ></div>
                      <span className="text-xs text-gray-500 mt-1">{datosComparativos.curso8B[index]}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div 
                        className="w-8 bg-yellow-500 rounded-t"
                        style={{ height: `${datosComparativos.curso9A[index] * 35}px` }}
                      ></div>
                      <span className="text-xs text-gray-500 mt-1">{datosComparativos.curso9A[index]}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-medium text-gray-700 mt-2">{periodo}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-500 mr-2"></div>
                  <span className="text-sm text-gray-700">8A</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 mr-2"></div>
                  <span className="text-sm text-gray-700">8B</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-yellow-500 mr-2"></div>
                  <span className="text-sm text-gray-700">9A</span>
                </div>
              </div>
              
              <button
                type="button"
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                Exportar PDF
              </button>
            </div>
          </div>
        );
        
      case 'avance':
        return (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Avance de Planeaciones</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Matemáticas 8A</span>
                  <span className="text-sm font-medium text-gray-700">75%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Español 9B</span>
                  <span className="text-sm font-medium text-gray-700">90%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '90%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Ciencias 10A</span>
                  <span className="text-sm font-medium text-gray-700">60%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Sociales 8B</span>
                  <span className="text-sm font-medium text-gray-700">85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Inglés 9A</span>
                  <span className="text-sm font-medium text-gray-700">70%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between mt-6">
              <div className="text-sm text-gray-700">
                <span className="font-medium">Avance total:</span> 76%
              </div>
              <button
                type="button"
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                Exportar PDF
              </button>
            </div>
          </div>
        );
        
      default:
        return <div>Seleccione un reporte para visualizar</div>;
    }
  };

  return (
    <PageBase 
      title="Reportes y Estadísticas" 
      subtitle="Visualización de datos académicos y administrativos"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Reportes Disponibles
            </h3>
            <nav className="space-y-1" aria-label="Sidebar">
              {reportesDisponibles().map((reporte) => (
                <button
                  key={reporte.id}
                  onClick={() => setReporteSeleccionado(reporte.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    reporteSeleccionado === reporte.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {reporte.nombre}
                </button>
              ))}
            </nav>
          </div>
        </div>
        
        <div className="md:col-span-3">
          {renderReporteSeleccionado()}
        </div>
      </div>
    </PageBase>
  );
};

export default Reportes; 