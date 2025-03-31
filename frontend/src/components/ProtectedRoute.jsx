import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Componente ProtectedRoute que verifica si el usuario está autenticado
 * Si no lo está, redirige a la página de login
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Componentes hijos a renderizar si está autenticado
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  console.log('ProtectedRoute - Estado de autenticación:', { user, loading });
  
  // Mostrar un indicador de carga mientras verificamos la autenticación
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-3 text-gray-600">Cargando...</p>
      </div>
    );
  }
  
  // Si no está autenticado, redirigir al login
  if (!user) {
    console.log('Usuario no autenticado, redirigiendo a login');
    return <Navigate to="/login" replace />;
  }
  
  // Si está autenticado, renderizar los hijos
  console.log('Usuario autenticado, mostrando contenido protegido');
  return children;
};

export default ProtectedRoute; 