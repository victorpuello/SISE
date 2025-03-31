// Configuración central para la aplicación

const config = {
  // API
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  
  // Tiempos de espera
  timeouts: {
    apiRequest: 30000, // 30 segundos para peticiones API
    sessionExpiry: 3600000, // 1 hora para expiración de sesión
  },
  
  // Configuración de almacenamiento
  storage: {
    userKey: 'siseUser',
    tokenKey: 'siseToken',
    preferenceKey: 'sisePreferences',
  },
  
  // Valores por defecto
  defaults: {
    itemsPerPage: 10,
    dateFormat: 'YYYY-MM-DD',
    timeFormat: 'HH:mm',
  },
  
  // Rutas de la aplicación
  routes: {
    home: '/',
    login: '/login',
    dashboard: '/dashboard',
    asistencias: '/asistencias',
    calificaciones: '/calificaciones',
    planeaciones: '/planeaciones',
    observador: '/observador',
    reportes: '/reportes',
  },

  // Configuración de CORS
  cors: {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  }
};

export default config; 