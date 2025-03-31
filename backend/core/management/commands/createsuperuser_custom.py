from django.core.management.base import BaseCommand
from core.models import User, Rol

class Command(BaseCommand):
    help = 'Crea un superusuario personalizado'

    def handle(self, *args, **options):
        # Verificar que exista el rol de Administrador
        rol_admin, created = Rol.objects.get_or_create(nombre='Administrador')
        
        self.stdout.write(self.style.SUCCESS('Creando superusuario...'))
        
        User.objects.create_superuser(
            email='admin@sise.edu.co',
            password='admin123',
            nombre='Admin',
            apellido='SISE',
            rol=rol_admin
        )
        
        self.stdout.write(self.style.SUCCESS('Superusuario creado exitosamente!')) 