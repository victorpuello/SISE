import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

// Mapeo de rutas a nombres legibles
const routeNameMapping = {
  'dashboard': 'Inicio',
  'usuarios': 'Usuarios',
  'asistencias': 'Asistencias',
  'calificaciones': 'Calificaciones',
  'planeaciones': 'Planeaciones',
  'observador': 'Observador',
  'reportes': 'Reportes',
  'profile': 'Mi Perfil',
  'nuevo': 'Nuevo',
  'editar': 'Editar',
  'cambiar-password': 'Cambiar Contraseña',
  'configuracion': 'Configuración'
};

/**
 * Componente Breadcrumbs para mostrar la ruta actual en formato de migas de pan
 */
export const Breadcrumbs = () => {
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
    
    // Construir migas de pan para cada segmento de la ruta
    pathSegments.forEach((segment, index) => {
      // Si es el primer segmento y ya tenemos el dashboard, no duplicar
      if (index === 0 && segment === 'dashboard') {
        return;
      }
      
      const name = routeNameMapping[segment] || segment;
      const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
      const current = index === pathSegments.length - 1;
      
      crumbs.push({ name, href, current });
    });
    
    return crumbs;
  }, [location.pathname, pathSegments]);

  // Si no hay segmentos o no hay migas de pan, no renderizar nada
  if (!pathSegments.length || breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className="flex px-5 py-3 bg-white shadow-sm border-b" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1 md:space-x-3">
        {breadcrumbs.map((item, index) => (
          <li key={item.name + index} className="inline-flex items-center">
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