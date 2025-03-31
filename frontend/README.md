# SISE - Frontend

Sistema de Información y Seguimiento Educativo - Aplicación Frontend desarrollada con React.

## Descripción

SISE es un sistema integral para la gestión escolar que permite administrar planeaciones, calificaciones, asistencias, observador del estudiante y reportes estadísticos. El frontend está construido con React, utilizando componentes funcionales, hooks, React Router v6 y Tailwind CSS para los estilos.

## Características principales

- **Autenticación de usuarios**: Sistema de login con diferentes roles (administrador, docente, estudiante, acudiente)
- **Estructura modular**: Arquitectura organizada por módulos según funcionalidad
- **Gestión académica**: Módulos para calificaciones, planeaciones, asistencia y observador
- **Reportes estadísticos**: Visualización de datos con gráficos y estadísticas
- **Diseño responsivo**: Interfaz adaptable a diferentes dispositivos
- **Seguridad por roles**: Acceso a funcionalidades según el rol del usuario

## Tecnologías utilizadas

- React 18
- React Router v6
- Tailwind CSS
- Heroicons
- Context API para gestión de estados

## Estructura del proyecto

```
sise-frontend/
├── public/            # Archivos estáticos
├── src/
│   ├── components/    # Componentes reutilizables
│   ├── context/       # Contextos de React (AuthContext)
│   ├── pages/         # Páginas principales
│   ├── App.js         # Componente principal
│   ├── index.js       # Punto de entrada
│   └── index.css      # Estilos globales
├── package.json       # Dependencias del proyecto
└── tailwind.config.js # Configuración de Tailwind CSS
```

## Instalación

1. Clona el repositorio
2. Instala las dependencias:
   ```
   npm install
   ```
3. Inicia el servidor de desarrollo:
   ```
   npm start
   ```

## Módulos principales

- **Dashboard**: Panel principal con acceso a módulos según rol
- **Planeaciones**: Gestión de planeaciones académicas
- **Calificaciones**: Registro y consulta de notas
- **Asistencias**: Control de asistencia a clases
- **Observador**: Registro de observaciones de estudiantes
- **Reportes**: Estadísticas y visualización de datos

## Contribución

Para contribuir al proyecto:
1. Haz un fork del repositorio
2. Crea una rama para tu funcionalidad (`git checkout -b feature/nueva-funcionalidad`)
3. Haz commit de tus cambios (`git commit -m 'Añadir nueva funcionalidad'`)
4. Haz push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request 