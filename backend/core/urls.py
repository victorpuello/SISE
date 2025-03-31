from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Configurar los routers para las vistas basadas en ViewSet
router = DefaultRouter()
router.register(r'usuarios', views.UserViewSet, basename='usuario')
router.register(r'roles', views.RolViewSet, basename='rol')

app_name = 'api'  # Namespace para la API

urlpatterns = [
    # Vista principal que sirve la aplicación de React
    path('', views.home, name='home'),
    
    # Endpoints para autenticación
    path('login/', views.api_login, name='login'),
    path('logout/', views.api_logout, name='logout'),
    path('user/', views.api_user, name='user'),
    
    # Incluir rutas auto-generadas por el router
    path('', include(router.urls)),
] 