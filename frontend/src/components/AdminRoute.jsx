import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Componente AdminRoute que verifica si el usuario es administrador
 * Si no lo es, redirige al dashboard
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Componentes hijos a renderizar si es administrador
 */
const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();
  
  console.log('AdminRoute - Estado de autenticación:', { 
    user: user ? { ...user, token: '***' } : null, 
    loading, 
    isAdmin: isAdmin() 
  });
  
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
  
  // Si no es administrador, redirigir al dashboard
  if (!isAdmin()) {
    console.log('Usuario no es administrador, redirigiendo a dashboard');
    return <Navigate to="/dashboard" replace />;
  }
  
  // Si es administrador, renderizar los hijos
  console.log('Usuario es administrador, mostrando contenido protegido');
  return children;
};

export default AdminRoute; 