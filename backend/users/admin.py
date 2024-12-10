from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    model = CustomUser

    fieldsets = (
        *UserAdmin.fieldsets,  # 기존 UserAdmin 필드셋 포함
        (None, {'fields': ('nickname', 'birthdate', 'full_name', 'gender')}),
    )
    
    add_fieldsets = (
        *UserAdmin.add_fieldsets,  # 기존 UserAdmin 추가 필드셋 포함
        (None, {'fields': ('nickname', 'birthdate', 'full_name', 'gender')}),
    )
    
    list_display = ('username', 'nickname', 'email', 'full_name', 'gender', 'is_staff')
    search_fields = ('username', 'nickname', 'email', 'full_name')

admin.site.register(CustomUser, CustomUserAdmin)
