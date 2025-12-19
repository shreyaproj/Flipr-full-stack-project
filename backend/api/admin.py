from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html
from .models import User, Project, Client, Contact, NewsletterSubscriber

class CustomUserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_admin', 'is_staff', 'is_superuser', 'date_joined', 'get_jwt_info')
    list_filter = ('is_admin', 'is_staff', 'is_superuser', 'is_active')
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'is_admin', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'is_staff', 'is_admin', 'is_superuser', 'is_active'),
        }),
    )
    search_fields = ('username', 'email', 'first_name', 'last_name')
    ordering = ('-date_joined',)
    
    def get_jwt_info(self, obj):
        if obj.is_admin:
            return format_html(
                '<span style="color: green;">✓ Can login to dashboard</span><br>'
                '<small>Use /admin/login page</small>'
            )
        return format_html('<span style="color: orange;">✗ Not an admin</span>')
    
    get_jwt_info.short_description = 'JWT Dashboard Access'

# Register models
admin.site.register(User, CustomUserAdmin)
admin.site.register(Project)
admin.site.register(Client)
admin.site.register(Contact)
admin.site.register(NewsletterSubscriber)

# Customize admin site
admin.site.site_header = "Portfolio Admin"
admin.site.site_title = "Portfolio Admin Portal"
admin.site.index_title = "Welcome to Portfolio Admin"