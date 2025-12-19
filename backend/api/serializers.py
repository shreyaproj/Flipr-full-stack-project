from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Project, Client, Contact, NewsletterSubscriber

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_admin']

class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'

class ProjectSerializer(serializers.ModelSerializer):
    # This read_only field is fine, DRF handles nulls automatically here
    client_name = serializers.CharField(source='client.name', read_only=True)
    
    class Meta:
        model = Project
        fields = '__all__'

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = '__all__'
        read_only_fields = ['submitted_at', 'is_read']

class NewsletterSubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterSubscriber
        fields = '__all__'
        read_only_fields = ['subscribed_at', 'unsubscribed_at']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        min_length=6,
        error_messages={
            'min_length': 'Password must be at least 6 characters long.'
        }
    )
    confirm_password = serializers.CharField(write_only=True, required=True)
    token = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'confirm_password', 'token']
        extra_kwargs = {
            'username': {'required': True},
            'email': {'required': True},
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Password fields didn't match."})
        
        if User.objects.filter(username=attrs['username']).exists():
            raise serializers.ValidationError({"username": "A user with that username already exists."})
        
        if User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError({"email": "A user with that email already exists."})
        
        return attrs

    def create(self, validated_data):
        # Remove confirm_password from validated_data
        validated_data.pop('confirm_password')
        
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            is_admin=True,
            is_staff=True  # Give staff permissions for Django admin
        )
        return user

    def get_token(self, obj):
        refresh = RefreshToken.for_user(obj)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }