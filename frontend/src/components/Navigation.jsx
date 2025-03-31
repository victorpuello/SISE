import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  HomeIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  ClipboardDocumentCheckIcon,
  BookOpenIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronRightIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import Breadcrumbs from './Breadcrumbs';
import { FaUsers, FaCog, FaSignOutAlt, FaCaretDown } from 'react-icons/fa';

// Configuración de la navegación
export const navigationConfig = {
  // Módulos base que todos pueden ver
  baseModules: [
    { id: 'dashboard', name: 'Inicio', href: '/dashboard', icon: HomeIcon }
  ],
  
  // Módulos específicos por rol
  roleModules: [
    {
      id: 'usuarios',
      name: 'Usuarios',
      href: '/usuarios',
      icon: UserGroupIcon,
      roles: ['Administrador'],
      breadcrumb: 'Gestión de Usuarios'
    },
    {
      id: 'asistencias',
      name: 'Asistencias',
      href: '/asistencias',
      icon: ClipboardDocumentCheckIcon,
      roles: ['Administrador', 'Docente', 'Estudiante', 'Acudiente'],
      breadcrumb: 'Control de Asistencias'
    },
    {
      id: 'calificaciones',
      name: 'Calificaciones',
      href: '/calificaciones',
      icon: ChartBarIcon,
      roles: ['Administrador', 'Docente', 'Estudiante', 'Acudiente'],
      breadcrumb: 'Gestión de Calificaciones'
    },
    {
      id: 'planeaciones',
      name: 'Planeaciones',
      href: '/planeaciones',
      icon: ClipboardDocumentListIcon,
      roles: ['Administrador', 'Docente'],
      breadcrumb: 'Planeaciones Académicas'
    },
    {
      id: 'observador',
      name: 'Observador',
      href: '/observador',
      icon: BookOpenIcon,
      roles: ['Administrador', 'Docente', 'Acudiente'],
      breadcrumb: 'Observador Académico'
    },
    {
      id: 'reportes',
      name: 'Reportes',
      href: '/reportes',
      icon: ChartBarIcon,
      roles: ['Administrador', 'Coordinador'],
      breadcrumb: 'Reportes y Estadísticas'
    }
  ],
  
  // Módulos de usuario
  userModules: [
    { id: 'profile', name: 'Mi Perfil', href: '/profile', icon: UserIcon }
  ]
};

// Componente de breadcrumbs
export const NavigationBreadcrumbs = ({ currentModule, currentPage }) => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  // Construir los breadcrumbs basados en los segmentos de la URL
  const breadcrumbs = useMemo(() => {
    // Si no hay segmentos, devolvemos un array vacío
    if (!pathSegments.length) {
      return [];
    }
    
    const crumbs = [
      { name: 'Inicio', href: '/dashboard', current: pathSegments[0] === 'dashboard' }
    ];
    
    // Encontrar el módulo actual en la configuración
    let moduleMatch;
    
    // Buscar en baseModules
    moduleMatch = navigationConfig.baseModules.find(m => m.id === pathSegments[0]);
    
    // Si no se encuentra, buscar en roleModules
    if (!moduleMatch) {
      moduleMatch = navigationConfig.roleModules.find(m => m.id === pathSegments[0]);
    }
    
    // Si no se encuentra, buscar en userModules
    if (!moduleMatch) {
      moduleMatch = navigationConfig.userModules.find(m => m.id === pathSegments[0]);
    }
    
    // Si encontramos el módulo, agregar su breadcrumb
    if (moduleMatch) {
      crumbs.push({
        name: moduleMatch.breadcrumb || moduleMatch.name,
        href: moduleMatch.href,
        current: pathSegments.length === 1
      });
    }
    
    // Si hay más segmentos, agregar páginas adicionales
    if (pathSegments.length > 1) {
      if (pathSegments[1] === 'nuevo') {
        crumbs.push({
          name: 'Nuevo',
          href: `/${pathSegments[0]}/${pathSegments[1]}`,
          current: pathSegments.length === 2
        });
      } else if (pathSegments[2] === 'editar') {
        crumbs.push({
          name: 'Editar',
          href: `/${pathSegments[0]}/${pathSegments[1]}/editar`,
          current: true
        });
      } else if (pathSegments[2] === 'cambiar-password') {
        crumbs.push({
          name: 'Cambiar Contraseña',
          href: `/${pathSegments[0]}/${pathSegments[1]}/cambiar-password`,
          current: true
        });
      } else if (pathSegments.length === 2) {
        crumbs.push({
          name: currentPage || 'Detalle',
          href: `/${pathSegments[0]}/${pathSegments[1]}`,
          current: true
        });
      }
    }
    
    return crumbs;
  }, [location.pathname, currentPage, pathSegments]);

  // Si no hay segmentos o no hay migas de pan, no renderizar nada
  if (!pathSegments.length || breadcrumbs.length === 0) {
    return null;
  }

  return (
    <nav className="flex px-5 py-3 bg-white shadow-sm border-b" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1 md:space-x-3">
        {breadcrumbs.map((item, index) => (
          <li key={item.name} className="inline-flex items-center">
            {index > 0 && (
              <ChevronRightIcon className="h-5 w-5 text-gray-400 mx-1" />
            )}
            <Link
              to={item.href}
              className={`inline-flex items-center text-sm ${
                item.current
                  ? 'font-medium text-blue-600'
                  : 'text-gray-500 hover:text-blue-600'
              }`}
              aria-current={item.current ? 'page' : undefined}
            >
              {index === 0 && <HomeIcon className="h-4 w-4 mr-1" />}
              {item.name}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
};

const Navigation = ({ toggleSidebar, isSidebarOpen }) => {
  const location = useLocation();
  const { user, loading, initialized, logout, isAdmin, isTeacher, isStudent, isGuardian, isCoordinator } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Cerrar menús al cambiar de ruta
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  // Cerrar menús si se hace clic fuera de ellos
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('#user-menu')) {
        setDropdownOpen(false);
      }
      if (isMobileMenuOpen && !event.target.closest('#mobile-menu') && !event.target.closest('#mobile-menu-button')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [dropdownOpen, isMobileMenuOpen]);

  // Filtrar módulos según los permisos del usuario
  const availableModules = useMemo(() => {
    if (!user) return [];
    
    // Filtrar módulos de rol basado en el rol del usuario
    const filteredRoleModules = navigationConfig.roleModules.filter(module => 
      module.roles.includes(user.rol)
    );
    
    // Combinar con módulos base y de usuario
    return [
      ...navigationConfig.baseModules,
      ...filteredRoleModules,
      ...navigationConfig.userModules
    ];
  }, [user, user?.rol]);

  // Verificar si una ruta está activa
  const isActive = (href) => {
    if (href === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(href);
  };

  // No mostrar navegación si está cargando o no está inicializado
  if (loading || !initialized) {
    return (
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-blue-600">SISE</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <div className="animate-pulse flex space-x-4">
                  <div className="h-8 w-20 bg-gray-200 rounded"></div>
                  <div className="h-8 w-20 bg-gray-200 rounded"></div>
                  <div className="h-8 w-20 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Si no hay usuario autenticado, no mostrar navegación
  if (!user) {
    return null;
  }

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 z-10 relative">
        <div className="max-w-full mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex justify-between h-16">
            {/* Logo y navegación principal */}
            <div className="flex">
              {/* Botón toggle sidebar (visible en todos los tamaños) */}
              <div className="flex items-center">
                <button
                  type="button"
                  className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
                  onClick={toggleSidebar}
                  aria-label="Alternar barra lateral"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
              
              <div className="flex-shrink-0 flex items-center ml-3">
                <Link to="/dashboard" className="flex items-center">
                  <span className="text-xl font-bold text-blue-600">SISE</span>
                  <span className="ml-1 text-sm text-gray-500 hidden sm:inline">Sistema Educativo</span>
                </Link>
              </div>
              
              {/* Navegación desktop */}
              <nav className="hidden md:ml-6 md:flex md:space-x-4 overflow-x-auto">
                {availableModules.filter(item => item.id !== 'profile').map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      isActive(item.href)
                        ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    } whitespace-nowrap inline-flex items-center px-3 py-2 text-sm font-medium rounded-md`}
                  >
                    <item.icon className="h-5 w-5 mr-1.5" />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            
            {/* Perfil de usuario y botones de acción */}
            <div className="flex items-center">
              {/* Indicador de rol */}
              <span className="hidden lg:block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full mr-2">
                {user.rol}
              </span>
              
              {/* Botón de perfil */}
              <div className="relative">
                <div>
                  <button
                    type="button"
                    className="flex items-center max-w-xs bg-white rounded-full focus:outline-none"
                    id="user-menu-button"
                    aria-expanded={isUserMenuOpen}
                    aria-haspopup="true"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  >
                    <span className="sr-only">Abrir menú de usuario</span>
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white overflow-hidden">
                        {user.nombre ? (
                          <span className="text-sm font-medium">{user.nombre.charAt(0)}{user.apellido?.charAt(0)}</span>
                        ) : (
                          <UserCircleIcon className="h-8 w-8" />
                        )}
                      </div>
                      <span className="ml-2 text-sm font-medium text-gray-700 hidden sm:block max-w-[120px] truncate">
                        {user.nombre} {user.apellido}
                      </span>
                    </div>
                  </button>
                </div>
                
                {/* Menú desplegable de usuario */}
                {isUserMenuOpen && (
                  <div 
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                    tabIndex="-1"
                  >
                    <Link 
                      to="/profile" 
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" 
                      role="menuitem"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <UserIcon className="h-4 w-4 mr-2" /> Mi Perfil
                    </Link>
                    <Link 
                      to="/configuracion" 
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" 
                      role="menuitem"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Cog6ToothIcon className="h-4 w-4 mr-2" /> Configuración
                    </Link>
                    <button 
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                      }} 
                      className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" 
                      role="menuitem"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg> 
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
              
              {/* Botón de menú móvil */}
              <div className="flex md:hidden ml-2">
                <button
                  type="button"
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                  aria-controls="mobile-menu"
                  aria-expanded={isMobileMenuOpen}
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <span className="sr-only">Abrir menú principal</span>
                  {isMobileMenuOpen ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Menú móvil */}
        {isMobileMenuOpen && (
          <div className="md:hidden" id="mobile-menu">
            <div className="pt-2 pb-3 space-y-1">
              {availableModules.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    isActive(item.href)
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent'
                  } block pl-3 pr-4 py-2 text-base font-medium`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <item.icon className="h-5 w-5 mr-2" />
                    {item.name}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Navigation; 