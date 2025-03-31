from django.shortcuts import render
from django.http import HttpResponse
from django.views.generic import TemplateView
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status, viewsets, filters
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from django.db.models import Q
from .models import User, Rol
from .serializers import (
    UserSerializer, UserCreateSerializer, UserDetailSerializer,
    UserUpdateSerializer, ChangePasswordSerializer, RolSerializer
)
from django.conf import settings
from .services.auth_service import AuthService
from .services.user_service import UserService

# Create your views here.

@ensure_csrf_cookie
def home(request):
    """
    Vista principal que sirve la aplicación de React.
    Esta vista se asegura de que la cookie CSRF esté establecida.
    """
    # Redirige a la aplicación React
    return render(request, 'index.html')

# Esta vista servirá para cualquier otra ruta que Django no reconozca,
# reenviando a React que manejará las rutas del cliente
class ReactAppView(TemplateView):
    template_name = 'index.html'

# API de prueba/salud
@api_view(['GET'])
@permission_classes([AllowAny])
def api_health_check(request):
    """
    Endpoint de verificación de salud/disponibilidad de la API
    """
    return Response({
        "status": "ok",
        "message": "API en funcionamiento",
        "version": "1.0.0"
    })

# Endpoints de autenticación
@api_view(['POST'])
@permission_classes([AllowAny])
def api_login(request):
    print(f"\n=== DEBUG LOGIN ===")
    print(f"Método HTTP: {request.method}")
    print(f"HEADERS: {dict(request.headers)}")
    print(f"BODY: {request.data}")
    print(f"=== FIN DEBUG ===\n")
    
    email = request.data.get('email')
    password = request.data.get('password')
    
    print(f"Email recibido: {email}")
    print(f"Password recibido: {'*' * len(password) if password else 'No proporcionado'}")
    
    return AuthService.login(email, password)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_logout(request):
    return AuthService.logout(request.user)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_user(request):
    return AuthService.get_current_user(request.user)

# ViewSet para el modelo Rol
class RolViewSet(viewsets.ModelViewSet):
    queryset = Rol.objects.all()
    serializer_class = RolSerializer
    permission_classes = [IsAuthenticated]
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

# ViewSet para el modelo User
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()  # Queryset por defecto
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['nombre', 'apellido', 'email']
    ordering_fields = ['nombre', 'apellido', 'email', 'rol__nombre']
    ordering = ['apellido', 'nombre']
    
    def get_queryset(self):
        return UserService.get_user_queryset(self.request.user)
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [IsAuthenticated()]
    
    def get_serializer_class(self):
        return UserService.get_serializer_class(self.action)
    
    def perform_create(self, serializer):
        serializer.save()
    
    def perform_update(self, serializer):
        serializer.save()
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_active = False
        instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def change_password(self, request, pk=None):
        user = self.get_object()
        serializer = ChangePasswordSerializer(data=request.data)
        
        if serializer.is_valid():
            return UserService.change_password(
                user,
                serializer.validated_data['old_password'],
                serializer.validated_data['new_password']
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def activate(self, request, pk=None):
        return UserService.activate_user(self.get_object())
    
    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def deactivate(self, request, pk=None):
        return UserService.deactivate_user(self.get_object())
