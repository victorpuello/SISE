from rest_framework import status
from rest_framework.response import Response
from ..models import User
from ..serializers import (
    UserSerializer, UserCreateSerializer, UserDetailSerializer,
    UserUpdateSerializer, ChangePasswordSerializer
)

class UserService:
    @staticmethod
    def get_user_queryset(user):
        """
        Obtiene el queryset de usuarios según los permisos
        """
        if user.is_staff:
            return User.objects.all()
        return User.objects.filter(id=user.id)

    @staticmethod
    def get_serializer_class(action):
        """
        Obtiene el serializer apropiado según la acción
        """
        if action == 'create':
            return UserCreateSerializer
        elif action in ['update', 'partial_update']:
            return UserUpdateSerializer
        elif action == 'retrieve':
            return UserDetailSerializer
        return UserSerializer

    @staticmethod
    def change_password(user, old_password, new_password):
        """
        Maneja el cambio de contraseña
        """
        if not user.check_password(old_password):
            return Response(
                {"detail": "La contraseña actual es incorrecta"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user.set_password(new_password)
        user.save()
        return Response({"detail": "Contraseña actualizada correctamente"})

    @staticmethod
    def activate_user(user):
        """
        Activa un usuario
        """
        user.is_active = True
        user.save()
        return Response({"detail": "Usuario activado correctamente"})

    @staticmethod
    def deactivate_user(user):
        """
        Desactiva un usuario
        """
        user.is_active = False
        user.save()
        return Response({"detail": "Usuario desactivado correctamente"}) 