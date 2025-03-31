from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

class Rol(models.Model):
    nombre = models.CharField(max_length=50)
    
    def __str__(self):
        return self.nombre
    
    class Meta:
        verbose_name_plural = "Roles"

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('El Email es obligatorio')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser debe tener is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser debe tener is_superuser=True.')
        
        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    rol = models.ForeignKey(Rol, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nombre', 'apellido']
    
    objects = UserManager()
    
    def __str__(self):
        return f"{self.nombre} {self.apellido}"
    
    def get_full_name(self):
        return f"{self.nombre} {self.apellido}"
    
    class Meta:
        verbose_name = "Usuario"
        verbose_name_plural = "Usuarios"

class Grado(models.Model):
    nombre = models.CharField(max_length=50)
    
    def __str__(self):
        return self.nombre

class Grupo(models.Model):
    nombre = models.CharField(max_length=10)
    grado = models.ForeignKey(Grado, on_delete=models.CASCADE, related_name='grupos')
    
    def __str__(self):
        return f"{self.grado.nombre} - {self.nombre}"
    
    class Meta:
        verbose_name = "Grupo"
        verbose_name_plural = "Grupos"

class Asignatura(models.Model):
    nombre = models.CharField(max_length=100)
    
    def __str__(self):
        return self.nombre

class Estudiante(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    grupo = models.ForeignKey(Grupo, on_delete=models.CASCADE, related_name='estudiantes')
    
    def __str__(self):
        return f"{self.user.nombre} {self.user.apellido} - {self.grupo}"
    
    class Meta:
        verbose_name = "Estudiante"
        verbose_name_plural = "Estudiantes"

class DocenteAsignaturaGrupo(models.Model):
    docente = models.ForeignKey(User, on_delete=models.CASCADE, related_name='asignaturas_grupos')
    asignatura = models.ForeignKey(Asignatura, on_delete=models.CASCADE)
    grupo = models.ForeignKey(Grupo, on_delete=models.CASCADE)
    
    def __str__(self):
        return f"{self.docente} - {self.asignatura} - {self.grupo}"
    
    class Meta:
        verbose_name = "Asignación Docente-Asignatura-Grupo"
        verbose_name_plural = "Asignaciones Docente-Asignatura-Grupo"
        unique_together = ['docente', 'asignatura', 'grupo']

class Periodo(models.Model):
    nombre = models.CharField(max_length=50)
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField()
    
    def __str__(self):
        return self.nombre
    
    class Meta:
        verbose_name = "Período"
        verbose_name_plural = "Períodos"

class Asistencia(models.Model):
    ESTADO_CHOICES = [
        ('P', 'Presente'),
        ('A', 'Ausente'),
        ('T', 'Tarde'),
        ('J', 'Justificado')
    ]
    
    estudiante = models.ForeignKey(Estudiante, on_delete=models.CASCADE, related_name='asistencias')
    fecha = models.DateField()
    estado = models.CharField(max_length=1, choices=ESTADO_CHOICES)
    observaciones = models.TextField(blank=True, null=True)
    registrada_por = models.ForeignKey(User, on_delete=models.CASCADE)
    
    def __str__(self):
        return f"{self.estudiante} - {self.fecha} - {self.get_estado_display()}"
    
    class Meta:
        verbose_name = "Asistencia"
        verbose_name_plural = "Asistencias"
        unique_together = ['estudiante', 'fecha']

class Calificacion(models.Model):
    estudiante = models.ForeignKey(Estudiante, on_delete=models.CASCADE, related_name='calificaciones')
    asignatura = models.ForeignKey(Asignatura, on_delete=models.CASCADE)
    periodo = models.ForeignKey(Periodo, on_delete=models.CASCADE)
    nota = models.DecimalField(max_digits=3, decimal_places=1)
    observaciones = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.estudiante} - {self.asignatura} - {self.periodo}: {self.nota}"
    
    class Meta:
        verbose_name = "Calificación"
        verbose_name_plural = "Calificaciones"
        unique_together = ['estudiante', 'asignatura', 'periodo']

class TipoObservacion(models.Model):
    nombre = models.CharField(max_length=100)
    
    def __str__(self):
        return self.nombre
    
    class Meta:
        verbose_name = "Tipo de Observación"
        verbose_name_plural = "Tipos de Observaciones"

class Observador(models.Model):
    estudiante = models.ForeignKey(Estudiante, on_delete=models.CASCADE, related_name='observaciones')
    tipo_observacion = models.ForeignKey(TipoObservacion, on_delete=models.CASCADE)
    registrada_por = models.ForeignKey(User, on_delete=models.CASCADE)
    fecha = models.DateField()
    descripcion = models.TextField()
    
    def __str__(self):
        return f"{self.estudiante} - {self.tipo_observacion} - {self.fecha}"
    
    class Meta:
        verbose_name = "Observador"
        verbose_name_plural = "Observaciones"

class Planeacion(models.Model):
    ESTADO_CHOICES = [
        ('B', 'Borrador'),
        ('E', 'Enviado'),
        ('A', 'Aprobado')
    ]
    
    docente = models.ForeignKey(User, on_delete=models.CASCADE, related_name='planeaciones')
    asignatura = models.ForeignKey(Asignatura, on_delete=models.CASCADE)
    grupo = models.ForeignKey(Grupo, on_delete=models.CASCADE)
    fecha = models.DateField()
    tema = models.CharField(max_length=200)
    objetivos = models.TextField()
    competencias = models.TextField()
    actividades = models.TextField()
    recursos = models.TextField()
    evaluacion = models.TextField()
    archivo_adjunto = models.FileField(upload_to='planeaciones/', blank=True, null=True)
    estado = models.CharField(max_length=1, choices=ESTADO_CHOICES, default='B')
    
    def __str__(self):
        return f"{self.docente} - {self.asignatura} - {self.grupo} - {self.fecha}"
    
    class Meta:
        verbose_name = "Planeación"
        verbose_name_plural = "Planeaciones"
