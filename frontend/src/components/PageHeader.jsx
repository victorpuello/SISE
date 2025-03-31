import React from 'react';
import PropTypes from 'prop-types';
import { NavigationBreadcrumbs } from './Navigation';

/**
 * Componente para el encabezado de las páginas
 * @param {string} title - Título principal de la página
 * @param {string} description - Descripción opcional de la página
 * @param {React.ReactNode} actions - Botones o acciones a mostrar a la derecha
 * @param {string} currentPage - Nombre de la página actual para el breadcrumb
 * @param {string} currentModule - Nombre del módulo actual para el breadcrumb
 */
const PageHeader = ({ 
  title, 
  description, 
  actions,
  currentPage,
  currentModule
}) => {
  return (
    <div className="pb-5 mb-5">
      {/* Breadcrumbs personalizados para esta página */}
      <NavigationBreadcrumbs currentPage={currentPage} currentModule={currentModule} />
      
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          {description && <p className="mt-2 text-sm text-gray-700">{description}</p>}
        </div>
        {actions && <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">{actions}</div>}
      </div>
    </div>
  );
};

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  actions: PropTypes.node
};

export default PageHeader; 