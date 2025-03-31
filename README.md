# SISE - Sistema Integral de Seguimiento Escolar

## Módulo de Usuarios

Este módulo permite la gestión completa de usuarios dentro del sistema SISE, incluyendo funcionalidades de listado, creación, edición, visualización detallada y cambio de contraseña.

### Estructura del Módulo

El módulo de usuarios está organizado de la siguiente manera:

- **Servicios**:
  - `usuariosService.js`: Centraliza todas las peticiones a la API relacionadas con usuarios.

- **Componentes**:
  - `UsuariosList.jsx`: Lista paginada de usuarios con búsqueda y filtros.
  - `UsuarioForm.jsx`: Formulario para crear y editar usuarios.
  - `UsuarioView.jsx`: Visualización detallada de la información de un usuario.
  - `ChangePassword.jsx`: Formulario para cambiar la contraseña de un usuario específico.

### Funcionalidades

1. **Listado de Usuarios**:
   - Búsqueda por nombre/email
   - Filtrado por rol y estado
   - Paginación
   - Acciones rápidas (ver, editar, eliminar)

2. **Creación y Edición**:
   - Formulario con validación
   - Selección de roles
   - Activación/desactivación de usuarios

3. **Vista Detallada**:
   - Información completa del usuario
   - Acciones disponibles (editar, eliminar, cambiar contraseña)

4. **Cambio de Contraseña**:
   - Para administradores: cambiar contraseña de cualquier usuario
   - Para usuarios: cambiar su propia contraseña desde el perfil

### Permisos

El acceso al módulo de usuarios está restringido a usuarios con rol de administrador, lo cual se controla mediante el componente `AdminRoute`.

### Tecnologías Utilizadas

- React con Hooks
- React Router para navegación
- Tailwind CSS para estilos
- SweetAlert2 para confirmaciones
- Axios para peticiones HTTP

### APIs Utilizadas

El módulo se conecta a los siguientes endpoints de la API:

- `GET /api/usuarios`: Obtener lista de usuarios
- `GET /api/usuarios/:id`: Obtener detalle de un usuario
- `POST /api/usuarios`: Crear nuevo usuario
- `PUT /api/usuarios/:id`: Actualizar usuario existente
- `DELETE /api/usuarios/:id`: Eliminar usuario
- `POST /api/usuarios/:id/change-password`: Cambiar contraseña

### Instalación y Uso

1. Asegúrate de tener Node.js instalado
2. Instala las dependencias: `npm install`
3. Inicia el servidor de desarrollo: `npm start`
4. Accede a `http://localhost:3000/usuarios` (requiere autenticación como administrador)

### Capturas de Pantalla

[Aquí se incluirían capturas de pantalla de las principales funcionalidades]

## Contribución

Para contribuir a este módulo:

1. Haz un fork del repositorio
2. Crea una rama con tu funcionalidad (`git checkout -b feature/nueva-funcionalidad`)
3. Haz commit de tus cambios (`git commit -m 'Añadir nueva funcionalidad'`)
4. Sube tus cambios (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## Licencia

[Especificar la licencia del proyecto] 