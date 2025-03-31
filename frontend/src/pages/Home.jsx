import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import {
  AcademicCapIcon,
  ClipboardDocumentCheckIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

const Home = () => {
  const modules = [
    {
      title: 'Planeación de Clases',
      description: 'Cree y gestione planeaciones de clases con objetivos, actividades y recursos.',
      icon: <ClipboardDocumentCheckIcon className="h-12 w-12" />,
    },
    {
      title: 'Calificaciones',
      description: 'Registre y consulte calificaciones por estudiante, grupo y período.',
      icon: <AcademicCapIcon className="h-12 w-12" />,
    },
    {
      title: 'Asistencias',
      description: 'Registre y monitoree la asistencia de los estudiantes diariamente.',
      icon: <UserGroupIcon className="h-12 w-12" />,
    },
    {
      title: 'Observador',
      description: 'Documente observaciones comportamentales y académicas de estudiantes.',
      icon: <DocumentTextIcon className="h-12 w-12" />,
    },
    {
      title: 'Reportes',
      description: 'Genere informes detallados sobre rendimiento académico y estadísticas.',
      icon: <ChartBarIcon className="h-12 w-12" />,
    },
  ];

  return (
    <>
      <Navbar />
      <div className="bg-white">
        {/* Hero Section */}
        <div className="relative bg-blue-700 text-white">
          <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Sistema Integral de Seguimiento Escolar
            </h1>
            <p className="mt-6 text-xl max-w-3xl mx-auto">
              Una plataforma completa para la gestión académica, seguimiento de estudiantes
              y comunicación efectiva entre docentes, estudiantes y acudientes.
            </p>
            <div className="mt-10">
              <Link
                to="/login"
                className="inline-block bg-white text-blue-700 px-8 py-3 border border-transparent rounded-md text-base font-medium hover:bg-blue-50"
              >
                Iniciar Sesión
              </Link>
            </div>
          </div>
          <div className="absolute bottom-0 inset-x-0 h-8 bg-white" style={{ clipPath: 'polygon(0 100%, 100% 100%, 50% 0)' }}></div>
        </div>

        {/* Modules Section */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-center text-gray-900 sm:text-4xl">
              Nuestros Módulos
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-center text-gray-500">
              SISE ofrece una suite completa de herramientas para modernizar la gestión escolar.
            </p>
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {modules.map((module, index) => (
                <div
                  key={index}
                  className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="p-6">
                    <div className="flex justify-center text-blue-600 mb-4">
                      {module.icon}
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 text-center">{module.title}</h3>
                    <p className="mt-2 text-base text-gray-500 text-center">{module.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonial/Quote Section */}
        <div className="bg-blue-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-blue-700">
                "La educación es el arma más poderosa que puedes usar para cambiar el mundo"
              </h2>
              <p className="mt-4 text-gray-600">— Nelson Mandela</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-sm">
                © Alcaldía de San Bernardo del Viento - 2025 · Desarrollado por Víctor Puello
              </p>
              <p className="text-xs mt-2 text-gray-400">
                Sistema Integral de Seguimiento Escolar - Todos los derechos reservados
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Home; 