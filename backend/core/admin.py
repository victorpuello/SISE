from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import (
    Rol, User, Grado, Grupo, Asignatura, Estudiante, 
    DocenteAsignaturaGrupo, Asistencia, Periodo, Calificacion, 
    TipoObservacion, Observador, Planeacion
)

@admin.register(Rol)
class RolAdmin(admin.ModelAdmin):
    list_display = ('nombre',)
    search_fields = ('nombre',)

class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'nombre', 'apellido', 'rol', 'is_staff')
    list_filter = ('rol', 'is_staff', 'is_superuser', 'is_active')
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Información Personal', {'fields': ('nombre', 'apellido', 'rol')}),
        ('Permisos', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'nombre', 'apellido', 'rol', 'password1', 'password2'),
        }),
    )
    search_fields = ('email', 'nombre', 'apellido')
    ordering = ('email',)
    filter_horizontal = ('groups', 'user_permissions',)

admin.site.register(User, UserAdmin)

@admin.register(Grado)
class GradoAdmin(admin.ModelAdmin):
    list_display = ('nombre',)
    search_fields = ('nombre',)

@admin.register(Grupo)
class GrupoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'grado')
    list_filter = ('grado',)
    search_fields = ('nombre', 'grado__nombre')

@admin.register(Asignatura)
class AsignaturaAdmin(admin.ModelAdmin):
    list_display = ('nombre',)
    search_fields = ('nombre',)

class EstudianteInline(admin.StackedInline):
    model = Estudiante
    can_delete = False
    verbose_name_plural = 'estudiante'

@admin.register(Estudiante)
class EstudianteAdmin(admin.ModelAdmin):
    list_display = ('get_nombre', 'get_apellido', 'get_email', 'grupo')
    list_filter = ('grupo', 'grupo__grado')
    search_fields = ('user__nombre', 'user__apellido', 'user__email', 'grupo__nombre', 'grupo__grado__nombre')
    
    def get_queryset(self, request):
        # Filtrar solo usuarios con rol de Estudiante
        qs = super().get_queryset(request)
        rol_estudiante = Rol.objects.filter(nombre='Estudiante').first()
        if rol_estudiante:
            return qs.filter(user__rol=rol_estudiante)
        return qs
    
    def get_nombre(self, obj):
        return obj.user.nombre
    get_nombre.short_description = 'Nombre'
    get_nombre.admin_order_field = 'user__nombre'
    
    def get_apellido(self, obj):
        return obj.user.apellido
    get_apellido.short_description = 'Apellido'
    get_apellido.admin_order_field = 'user__apellido'
    
    def get_email(self, obj):
        return obj.user.email
    get_email.short_description = 'Email'
    get_email.admin_order_field = 'user__email'

@admin.register(DocenteAsignaturaGrupo)
class DocenteAsignaturaGrupoAdmin(admin.ModelAdmin):
    list_display = ('docente', 'asignatura', 'grupo')
    list_filter = ('asignatura', 'grupo', 'grupo__grado')
    search_fields = ('docente__nombre', 'docente__apellido', 'asignatura__nombre', 'grupo__nombre')
    
    def get_queryset(self, request):
        # Filtrar solo usuarios con rol de Docente
        qs = super().get_queryset(request)
        rol_docente = Rol.objects.filter(nombre='Docente').first()
        if rol_docente:
            return qs.filter(docente__rol=rol_docente)
        return qs
    
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "docente":
            rol_docente = Rol.objects.filter(nombre='Docente').first()
            if rol_docente:
                kwargs["queryset"] = User.objects.filter(rol=rol_docente)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

@admin.register(Periodo)
class PeriodoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'fecha_inicio', 'fecha_fin')
    search_fields = ('nombre',)

@admin.register(Asistencia)
class AsistenciaAdmin(admin.ModelAdmin):
    list_display = ('estudiante', 'fecha', 'estado', 'registrada_por')
    list_filter = ('estado', 'fecha', 'estudiante__grupo', 'estudiante__grupo__grado')
    search_fields = ('estudiante__user__nombre', 'estudiante__user__apellido', 'observaciones')
    date_hierarchy = 'fecha'

@admin.register(Calificacion)
class CalificacionAdmin(admin.ModelAdmin):
    list_display = ('estudiante', 'asignatura', 'periodo', 'nota')
    list_filter = ('asignatura', 'periodo', 'estudiante__grupo', 'estudiante__grupo__grado')
    search_fields = ('estudiante__user__nombre', 'estudiante__user__apellido', 'observaciones')

@admin.register(TipoObservacion)
class TipoObservacionAdmin(admin.ModelAdmin):
    list_display = ('nombre',)
    search_fields = ('nombre',)

@admin.register(Observador)
class ObservadorAdmin(admin.ModelAdmin):
    list_display = ('estudiante', 'tipo_observacion', 'fecha', 'registrada_por')
    list_filter = ('tipo_observacion', 'fecha', 'estudiante__grupo', 'estudiante__grupo__grado')
    search_fields = ('estudiante__user__nombre', 'estudiante__user__apellido', 'descripcion')
    date_hierarchy = 'fecha'

@admin.register(Planeacion)
class PlaneacionAdmin(admin.ModelAdmin):
    list_display = ('docente', 'asignatura', 'grupo', 'fecha', 'tema', 'estado')
    list_filter = ('estado', 'asignatura', 'grupo', 'grupo__grado')
    search_fields = ('docente__nombre', 'docente__apellido', 'tema', 'objetivos', 'competencias')
    date_hierarchy = 'fecha'
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        # Si el usuario no es superusuario y es un docente, solo mostrar sus planeaciones
        if not request.user.is_superuser and hasattr(request.user, 'rol') and request.user.rol.nombre == 'Docente':
            return qs.filter(docente=request.user)
        return qs
