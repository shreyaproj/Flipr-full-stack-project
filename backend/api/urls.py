from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'projects', views.ProjectViewSet)
router.register(r'clients', views.ClientViewSet)
router.register(r'contact', views.ContactViewSet)
router.register(r'newsletter', views.NewsletterSubscriberViewSet)

urlpatterns = [
    path('auth/register/', views.register_admin, name='register'),
    path('auth/login/', views.login_admin, name='login'),
    path('', include(router.urls)),
]