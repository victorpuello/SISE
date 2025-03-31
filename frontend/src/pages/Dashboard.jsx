import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PageHeader from '../components/PageHeader';
import { FaUsers, FaUserGraduate, FaChalkboardTeacher, FaCalendarCheck, FaClipboardList, FaChartBar } from 'react-icons/fa';

const Dashboard = () => {
  const { user, isAdmin, isTeacher, isStudent } = useAuth();
  const [stats, setStats] = useState({
    usuarios: 0,
    estudiantes: 0,
    profesores: 0,
    asistencias: 0,
    calificaciones: 0
  });
  const [loading, setLoading] = useState(true);

  // Simulación de carga de estadísticas
  useEffect(() => {
    const fetchStats = () => {
      // En un caso real, esto sería una llamada API
      setTimeout(() => {
        setStats({
          usuarios: 156,
          estudiantes: 120,
          profesores: 15,
          asistencias: 450,
          calificaciones: 780
        });
        setLoading(false);
      }, 1000);
    };

    fetchStats();
  }, []);

  // Formatear los números con separadores de miles
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Tarjetas de estadísticas específicas según el rol
  const getStatCards = () => {
    if (isAdmin()) {
      return (
        <>
          <StatCard 
            title="Usuarios" 
            value={stats.usuarios} 
            icon={<FaUsers className="text-blue-600" />}
            loading={loading} 
            path="/usuarios"
          />
          <StatCard 
            title="Estudiantes" 
            value={stats.estudiantes} 
            icon={<FaUserGraduate className="text-green-600" />}
            loading={loading}
          />
          <StatCard 
            title="Profesores" 
            value={stats.profesores} 
            icon={<FaChalkboardTeacher className="text-purple-600" />}
            loading={loading}
          />
          <StatCard 
            title="Asistencias" 
            value={stats.asistencias} 
            icon={<FaCalendarCheck className="text-yellow-600" />}
            loading={loading}
            path="/asistencias"
          />
          <StatCard 
            title="Calificaciones" 
            value={stats.calificaciones} 
            icon={<FaClipboardList className="text-red-600" />}
            loading={loading}
            path="/calificaciones"
          />
        </>
      );
    } 
    
    if (isTeacher()) {
      return (
        <>
          <StatCard 
            title="Estudiantes" 
            value={stats.estudiantes} 
            icon={<FaUserGraduate className="text-green-600" />}
            loading={loading}
          />
          <StatCard 
            title="Asistencias" 
            value={stats.asistencias} 
            icon={<FaCalendarCheck className="text-yellow-600" />}
            loading={loading}
            path="/asistencias"
          />
          <StatCard 
            title="Calificaciones" 
            value={stats.calificaciones} 
            icon={<FaClipboardList className="text-red-600" />}
            loading={loading}
            path="/calificaciones"
          />
        </>
      );
    }
    
    if (isStudent()) {
      return (
        <>
          <StatCard 
            title="Asistencias" 
            value={stats.asistencias} 
            icon={<FaCalendarCheck className="text-yellow-600" />}
            loading={loading}
            path="/asistencias"
          />
          <StatCard 
            title="Calificaciones" 
            value={stats.calificaciones} 
            icon={<FaClipboardList className="text-red-600" />}
            loading={loading}
            path="/calificaciones"
          />
        </>
      );
    }
    
    return null;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`¡Bienvenido, ${user?.nombre || 'Usuario'}!`}
        description="Sistema Integral de Seguimiento Escolar"
      />
      
      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {getStatCards()}
      </div>
      
      {/* Módulos principales */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Módulos Principales</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {isAdmin() && (
            <ModuleCard 
              title="Gestión de Usuarios" 
              description="Administra los usuarios del sistema, asigna roles y permisos"
              icon={<FaUsers />}
              path="/usuarios"
              color="bg-blue-600"
            />
          )}
          
          {(isAdmin() || isTeacher()) && (
            <ModuleCard 
              title="Control de Asistencias" 
              description="Registra y consulta la asistencia de los estudiantes"
              icon={<FaCalendarCheck />}
              path="/asistencias"
              color="bg-yellow-600"
            />
          )}
          
          <ModuleCard 
            title="Gestión de Calificaciones" 
            description="Administra y consulta las calificaciones por estudiante, grupo o materia"
            icon={<FaClipboardList />}
            path="/calificaciones"
            color="bg-red-600"
          />
          
          {(isAdmin() || isTeacher()) && (
            <ModuleCard 
              title="Planeaciones Académicas" 
              description="Crea y gestiona planeaciones para tus clases"
              icon={<FaChartBar />}
              path="/planeaciones"
              color="bg-purple-600"
            />
          )}
        </div>
      </div>
      
      {/* Actividad reciente */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Actividad Reciente</h2>
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <ActivityLog />
        </div>
      </div>
    </div>
  );
};

// Componente de tarjeta de estadísticas
const StatCard = ({ title, value, icon, loading, path }) => {
  const formattedValue = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const content = (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          {loading ? (
            <div className="h-8 w-16 bg-gray-200 animate-pulse rounded mt-1"></div>
          ) : (
            <p className="text-2xl font-semibold text-gray-900">{formattedValue}</p>
          )}
        </div>
        <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
          {icon}
        </div>
      </div>
    </div>
  );
  
  if (path) {
    return <Link to={path} className="block">{content}</Link>;
  }
  
  return content;
};

// Componente de tarjeta de módulo
const ModuleCard = ({ title, description, icon, path, color }) => (
  <Link to={path} className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
    <div className={`${color} h-2`}></div>
    <div className="p-5">
      <div className="flex items-center mb-2">
        <div className={`${color} bg-opacity-20 rounded-full p-2 mr-3`}>
          {React.cloneElement(icon, { className: `${color.replace('bg-', 'text-')}` })}
        </div>
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      </div>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  </Link>
);

// Componente de actividad reciente
const ActivityLog = () => {
  // Datos de ejemplo, en una aplicación real esto vendría de una API
  const activities = [
    { id: 1, type: 'user', message: 'Nuevo usuario registrado', user: 'María García', time: '10 min', icon: <FaUsers className="text-blue-500" /> },
    { id: 2, type: 'grade', message: 'Calificaciones actualizadas', user: 'Juan Pérez', time: '1 hora', icon: <FaClipboardList className="text-red-500" /> },
    { id: 3, type: 'attendance', message: 'Registro de asistencia completado', user: 'Carolina Ruiz', time: '2 horas', icon: <FaCalendarCheck className="text-yellow-500" /> },
    { id: 4, type: 'plan', message: 'Nueva planeación creada', user: 'Roberto Sánchez', time: '3 horas', icon: <FaChartBar className="text-purple-500" /> },
  ];
  
  return (
    <div className="divide-y divide-gray-200">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start p-4 hover:bg-gray-50">
          <div className="flex-shrink-0 mr-3">
            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
              {activity.icon}
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900">{activity.message}</p>
            <p className="text-sm text-gray-500">
              <span>{activity.user}</span>
              <span className="mx-1">•</span>
              <span>hace {activity.time}</span>
            </p>
          </div>
        </div>
      ))}
      
      {activities.length === 0 && (
        <div className="p-4 text-center text-gray-500">
          No hay actividad reciente
        </div>
      )}
    </div>
  );
};

export default Dashboard; 