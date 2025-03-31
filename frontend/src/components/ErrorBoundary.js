import React, { Component } from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Actualiza el estado para que el siguiente renderizado muestre la UI alternativa
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // También puedes registrar el error en un servicio de reporte de errores
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Aquí podríamos enviar el error a un servicio de monitoreo
    console.error('Error capturado por ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Renderiza cualquier UI alternativa
      return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <div className="text-center">
              <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-yellow-500" />
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Algo salió mal
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Ha ocurrido un error en la aplicación.
              </p>
            </div>
            <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              {process.env.NODE_ENV === 'development' && (
                <div className="mb-4 overflow-auto max-h-96 bg-red-50 p-4 rounded-md">
                  <h3 className="text-red-800 font-medium">Detalles del error (solo visible en desarrollo):</h3>
                  <p className="mt-2 text-red-700 text-sm">{this.state.error && this.state.error.toString()}</p>
                  <pre className="mt-2 text-red-700 text-xs">
                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                  </pre>
                </div>
              )}
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    this.setState({ hasError: false });
                    window.location.href = '/';
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Volver al inicio
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary; 