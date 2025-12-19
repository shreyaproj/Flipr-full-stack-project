from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

class User(AbstractUser):
    is_admin = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date_joined']

class Client(models.Model):
    name = models.CharField(max_length=255)
    # Renamed 'logo' to 'image' to match PDF requirement "Client's Image"
    image = models.ImageField(upload_to='clients/', blank=True, null=True) 
    # Added 'designation' as required by PDF (e.g. CEO, Web Developer)
    designation = models.CharField(max_length=100, default="Client") 
    description = models.TextField(blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['-created_at']

class Project(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    image = models.ImageField(upload_to='projects/')
    link = models.URLField(blank=True)
    
    # Kept optional to prevent "Field required" errors if not selected
    client = models.ForeignKey('Client', on_delete=models.CASCADE, null=True, blank=True) 
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Contact(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    # Added 'mobile' and 'city' as required by PDF instructions
    mobile = models.CharField(max_length=20) 
    city = models.CharField(max_length=100) 
    
    # Made message optional because PDF reference image doesn't show a message box
    subject = models.CharField(max_length=255, blank=True, null=True)
    message = models.TextField(blank=True, null=True) 
    
    is_read = models.BooleanField(default=False)
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.email}"

    class Meta:
        ordering = ['-submitted_at']

class NewsletterSubscriber(models.Model):
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    subscribed_at = models.DateTimeField(auto_now_add=True)
    unsubscribed_at = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return self.email

    class Meta:
        ordering = ['-subscribed_at']