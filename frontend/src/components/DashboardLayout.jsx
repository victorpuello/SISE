import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';
import Sidebar from './Sidebar';
import { Breadcrumbs } from './Breadcrumbs';

/**
 * Componente DashboardLayout principal que incluye barra superior, barra lateral y migas de pan
 * Es la estructura base para todas las páginas del dashboard
 */
const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Ajustar sidebar basado en tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    
    // Inicializar basado en tamaño actual
    handleResize();
    
    // Agregar listener para cambios de tamaño
    window.addEventListener('resize', handleResize);
    
    // Limpiar listener
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Sidebar (lateral) - visible en escritorio o cuando está abierto */}
      <div 
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed md:relative inset-y-0 left-0 z-40 transition-transform duration-300 ease-in-out md:translate-x-0 md:flex md:flex-shrink-0`}
      >
        <Sidebar />
      </div>
      
      {/* Overlay para cerrar sidebar en móvil */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-gray-600 bg-opacity-75 z-30"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
      
      {/* Contenido principal */}
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        {/* Barra superior */}
        <Navigation 
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
          isSidebarOpen={sidebarOpen} 
        />
        
        {/* Migas de pan */}
        <Breadcrumbs />
        
        {/* Contenido principal - renderiza los children */}
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 