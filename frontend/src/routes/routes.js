import React from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import Dashboard from '../pages/Dashboard';
import Login from '../pages/Login';
import Profile from '../pages/Profile';
import PerfilPassword from '../pages/profile/PerfilPassword';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminRoute from '../components/AdminRoute';

// Importar componentes del módulo de usuarios
import UsuariosList from '../pages/usuarios/UsuariosList';
import UsuarioForm from '../pages/usuarios/UsuarioForm';
import UsuarioView from '../pages/usuarios/UsuarioView';
import ChangePassword from '../pages/usuarios/ChangePassword';

// Componente de página en construcción
const PlaceholderPage = ({ title }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-50 p-6 rounded-lg shadow-sm">
    <div className="text-center">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">{title}</h1>
      <p className="text-gray-600 mb-6">Esta página está en construcción.</p>
      <div className="w-20 h-20 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin mx-auto mb-6"></div>
      <p className="text-sm text-gray-500">Estamos trabajando para implementar esta funcionalidad próximamente.</p>
    </div>
  </div>
);

// Definición de rutas
const routes = [
  // Ruta pública: Login
  {
    path: '/login',
    element: <Login />
  },
  
  // Ruta para redirigir desde la raíz al dashboard
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />
  },
  
  // Layout principal del dashboard (protegido)
  {
    path: '/',
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      // Dashboard - accesible para todos los usuarios autenticados
      {
        path: 'dashboard',
        element: <Dashboard />
      },
      
      // Perfil de usuario
      {
        path: 'profile',
        element: <Profile />
      },
      
      // Cambio de contraseña del perfil
      {
        path: 'profile/cambiar-password',
        element: <PerfilPassword />
      },
      
      // Rutas del módulo de usuarios (admin)
      {
        path: 'usuarios',
        element: <AdminRoute><UsuariosList /></AdminRoute>
      },
      {
        path: 'usuarios/nuevo',
        element: <AdminRoute><UsuarioForm /></AdminRoute>
      },
      {
        path: 'usuarios/:id',
        element: <AdminRoute><UsuarioView /></AdminRoute>
      },
      {
        path: 'usuarios/:id/editar',
        element: <AdminRoute><UsuarioForm /></AdminRoute>
      },
      {
        path: 'usuarios/:id/cambiar-password',
        element: <AdminRoute><ChangePassword /></AdminRoute>
      },
      
      // Rutas de módulos con placeholders
      {
        path: 'asistencias',
        element: <PlaceholderPage title="Gestión de Asistencias" />
      },
      {
        path: 'calificaciones',
        element: <PlaceholderPage title="Gestión de Calificaciones" />
      },
      {
        path: 'planeaciones',
        element: <PlaceholderPage title="Planeaciones Académicas" />
      },
      {
        path: 'observador',
        element: <PlaceholderPage title="Observador del Estudiante" />
      },
      {
        path: 'reportes',
        element: <PlaceholderPage title="Reportes y Estadísticas" />
      },
      
      // Ruta para páginas no encontradas
      {
        path: '*',
        element: <PlaceholderPage title="Página No Encontrada" />
      }
    ]
  }
];

export default routes; 