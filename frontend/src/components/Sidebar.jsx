import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { navigationConfig } from './Navigation';
import {
  HomeIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  ClipboardDocumentCheckIcon,
  BookOpenIcon,
  UserIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { FaUsers } from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();
  const { user, logout, isAdmin } = useAuth();
  const [availableModules, setAvailableModules] = useState([]);
  
  // Determinar si un enlace está activo
  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };
  
  // Clase para enlaces activos
  const activeClass = "bg-blue-700 text-white";
  
  // Clase para enlaces inactivos
  const inactiveClass = "text-blue-100 hover:bg-blue-600 hover:text-white";
  
  // Actualizar módulos disponibles cuando cambie el rol del usuario
  useEffect(() => {
    if (!user) {
      setAvailableModules([]);
      return;
    }
    
    // Filtrar módulos de rol basado en el rol del usuario
    const filteredRoleModules = navigationConfig.roleModules.filter(module => 
      module.roles.includes(user.rol)
    );
    
    // Añadir manualmente la ruta de usuarios si el usuario es administrador
    const userModules = [];
    if (user.rol === 'admin' || user.rol === 'Administrador') {
      userModules.push({
        id: 'usuarios',
        name: 'Usuarios',
        href: '/usuarios',
        icon: FaUsers,
        roles: ['admin', 'Administrador'],
        breadcrumb: 'Gestión de Usuarios'
      });
    }
    
    // Combinar con módulos base y de usuario
    setAvailableModules([
      ...navigationConfig.baseModules,
      ...filteredRoleModules,
      ...userModules,
      ...navigationConfig.userModules
    ]);
  }, [user, user?.rol]);
  
  return (
    <div className="h-full w-64 bg-blue-800 text-white flex flex-col shadow-lg">
      {/* Logo o título */}
      <div className="px-4 py-4 mb-2">
        <h1 className="text-xl font-bold">SISE</h1>
        <p className="text-sm text-blue-200">Sistema Educativo</p>
      </div>
      
      {/* Información del usuario */}
      <div className="px-4 py-2 mb-4 bg-blue-900 bg-opacity-50">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center overflow-hidden">
            {user?.nombre ? (
              <span className="text-lg font-semibold">{user.nombre.charAt(0)}{user.apellido?.charAt(0)}</span>
            ) : (
              <span className="text-lg font-semibold">?</span>
            )}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium truncate">{user?.nombre} {user?.apellido}</p>
            <p className="text-xs text-blue-300 capitalize">{user?.rol || 'Usuario'}</p>
          </div>
        </div>
      </div>
      
      {/* Menú de navegación */}
      <nav className="flex-1 px-2 overflow-y-auto">
        <ul className="space-y-1">
          {availableModules.map((item) => (
            <li key={item.id || item.name}>
              <Link 
                to={item.href} 
                className={`flex items-center px-4 py-2 rounded-md ${isActive(item.href) ? activeClass : inactiveClass}`}
              >
                {item.icon && <item.icon className="w-5 h-5 mr-3" />}
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Botón de cerrar sesión */}
      <div className="px-2 py-4 mt-auto">
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-2 text-blue-100 rounded-md hover:bg-blue-600 hover:text-white"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 