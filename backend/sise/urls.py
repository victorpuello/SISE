"""
URL configuration for sise project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.authtoken import views as token_views
from core.views import ReactAppView, api_health_check, home

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # API endpoints
    path('api/health/', api_health_check, name='api-health-check'),
    path('api/token-auth/', token_views.obtain_auth_token, name='api-token-auth'),
    path('api/', include('core.urls', namespace='api')),
    
    # Frontend URLs - La vista principal y React para rutas no capturadas
    path('', home, name='home'),
    re_path(r'^.*$', ReactAppView.as_view(), name='react-app'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Servir archivos estáticos en desarrollo
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Personalizar títulos del admin
admin.site.site_header = "SISE - Administración"
admin.site.site_title = "SISE - Panel de Control"
admin.site.index_title = "Bienvenido al Sistema Integral de Seguimiento Escolar"
