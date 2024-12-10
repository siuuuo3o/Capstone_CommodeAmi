from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    GENDER_CHOICES = (
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    )

    email = models.EmailField(unique=True)
    nickname = models.CharField(max_length=30, unique=True)
    birthdate = models.DateField(null=True, blank=True)
    full_name = models.CharField(max_length=100, blank=True)  # 성과 이름을 합친 필드
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, blank=True)

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='customuser_set',
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups'
    )

    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='customuser_set',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions'
    )

    def __str__(self):
        return self.nickname if self.nickname else self.username
