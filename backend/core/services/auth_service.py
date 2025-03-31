from rest_framework.authtoken.models import Token
from rest_framework import status
from rest_framework.response import Response
from ..models import User

class AuthService:
    @staticmethod
    def normalize_role(role):
        """
        Normaliza el nombre del rol para asegurar consistencia
        """
        if not role:
            return "Estudiante"
            
        # Diccionario de conversión de roles
        roles = {
            "administrador": "Administrador",
            "docente": "Docente",
            "estudiante": "Estudiante",
            "acudiente": "Acudiente",
            "coordinador": "Coordinador"
        }
        
        # Normalizar a minúsculas y buscar en el diccionario
        normalized_role = roles.get(role.lower(), "Estudiante")
        return normalized_role
    
    @staticmethod
    def login(email, password):
        """
        Maneja el proceso de inicio de sesión
        """
        print(f"\n=== INICIO DE LOGIN ===")
        print(f"Email recibido: {email}")
        
        if not email or not password:
            print("Email o contraseña no proporcionados")
            return Response(
                {"detail": "Por favor proporcione email y contraseña"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user_obj = User.objects.get(email=email)
            print(f"Usuario encontrado: {user_obj.email}")
            print(f"Rol del usuario (DB): {user_obj.rol.nombre if user_obj.rol else 'Sin rol'}")
            print(f"¿Está activo? {user_obj.is_active}")
            
            if not user_obj.is_active:
                print("Usuario inactivo")
                return Response(
                    {"detail": "El usuario está inactivo"},
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            if user_obj.check_password(password):
                print("Contraseña correcta")
                # Obtener y normalizar el rol
                raw_role = user_obj.rol.nombre if user_obj.rol else "Estudiante"
                rol = AuthService.normalize_role(raw_role)
                print(f"Rol original: {raw_role}")
                print(f"Rol normalizado: {rol}")
                
                # Crear o obtener el token
                token, created = Token.objects.get_or_create(user=user_obj)
                print(f"Token generado: {token.key[:10]}... {'(creado nuevo)' if created else '(existente)'}")
                
                # Determinar si es admin basado en el rol normalizado
                is_admin = rol == "Administrador"
                print(f"¿Es administrador?: {is_admin}")
                
                user_data = {
                    "id": user_obj.id,
                    "email": user_obj.email,
                    "nombre": user_obj.nombre,
                    "apellido": user_obj.apellido,
                    "rol": rol,
                    "is_staff": user_obj.is_staff,
                    "is_active": user_obj.is_active,
                    "is_admin": is_admin,
                    "token": token.key
                }
                
                print(f"Datos del usuario enviados: {user_data}")
                print("=== FIN DE LOGIN ===\n")
                return Response(user_data)
            else:
                print("Contraseña incorrecta")
                return Response(
                    {"detail": "Contraseña incorrecta"},
                    status=status.HTTP_401_UNAUTHORIZED
                )
        except User.DoesNotExist:
            print("Usuario no encontrado")
            return Response(
                {"detail": "No existe un usuario con este correo electrónico"},
                status=status.HTTP_401_UNAUTHORIZED
            )
        except Exception as e:
            print(f"Error inesperado: {str(e)}")
            return Response(
                {"detail": "Error durante el proceso de autenticación"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @staticmethod
    def get_current_user(user):
        """
        Obtiene la información del usuario actual
        """
        print(f"\n=== OBTENER USUARIO ACTUAL ===")
        try:
            # Obtener y normalizar el rol
            raw_role = user.rol.nombre if user.rol else "Estudiante"
            rol = AuthService.normalize_role(raw_role) 
            print(f"Rol original: {raw_role}")
            print(f"Rol normalizado: {rol}")
            
            is_admin = rol == "Administrador"
            print(f"¿Es administrador?: {is_admin}")
            
            data = {
                "id": user.id,
                "email": user.email,
                "nombre": user.nombre,
                "apellido": user.apellido,
                "rol": rol,
                "is_staff": user.is_staff,
                "is_active": user.is_active,
                "is_admin": is_admin
            }
            
            print(f"Datos del usuario actual enviados: {data}")
            print("=== FIN DE OBTENER USUARIO ===\n")
            return Response(data)
        except Exception as e:
            print(f"Error al obtener usuario: {str(e)}")
            return Response(
                {"detail": "Error al obtener información del usuario"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @staticmethod
    def logout(user):
        """
        Maneja el proceso de cierre de sesión
        """
        print(f"\n=== LOGOUT ===")
        if hasattr(user, 'auth_token'):
            user.auth_token.delete()
            print("Token eliminado")
        print("=== FIN DE LOGOUT ===\n")
        return Response({"detail": "Sesión cerrada correctamente"}) 