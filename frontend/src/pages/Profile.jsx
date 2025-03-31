import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaIdCard, FaBuildingUser, FaLock } from 'react-icons/fa6';
import PageHeader from '../components/PageHeader';

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="animate-pulse">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mi Perfil"
        description="Información de tu cuenta de usuario"
        actions={
          <Link
            to="/profile/cambiar-password"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FaLock className="mr-2" /> Cambiar Contraseña
          </Link>
        }
      />
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* Información principal */}
        <div className="p-6">
          <div className="flex items-center mb-6">
            <div className="h-24 w-24 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-3xl font-bold">
              {user?.nombre?.charAt(0) || '?'}{user?.apellido?.charAt(0) || ''}
            </div>
            <div className="ml-6">
              <h2 className="text-2xl font-semibold text-gray-900">{user?.nombre} {user?.apellido}</h2>
              <p className="text-gray-600">{user?.email}</p>
              <div className="mt-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {user?.rol}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Información Personal</h3>
            
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div className="bg-gray-50 px-4 py-3 rounded-md">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <FaUser className="mr-2 text-gray-400" /> Nombre Completo
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{user?.nombre} {user?.apellido}</dd>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 rounded-md">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <FaEnvelope className="mr-2 text-gray-400" /> Correo Electrónico
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{user?.email}</dd>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 rounded-md">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <FaIdCard className="mr-2 text-gray-400" /> Nombre de Usuario
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{user?.username || user?.email}</dd>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 rounded-md">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <FaBuildingUser className="mr-2 text-gray-400" /> Rol en el Sistema
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{user?.rol}</dd>
              </div>
            </dl>
          </div>
          
          {/* Información de seguridad */}
          <div className="border-t border-gray-200 pt-6 mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Seguridad de la Cuenta</h3>
            
            <div className="bg-gray-50 p-4 rounded-md flex items-start justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-700 flex items-center">
                  <FaLock className="mr-2 text-gray-400" /> Contraseña
                </h4>
                <p className="mt-1 text-sm text-gray-500">
                  Tu contraseña fue actualizada por última vez el: {user?.last_password_change || 'No disponible'}
                </p>
              </div>
              <Link
                to="/profile/cambiar-password"
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cambiar
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 