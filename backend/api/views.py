from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, get_user_model
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from .models import Project, Client, Contact, NewsletterSubscriber
from .serializers import (
    UserSerializer, RegisterSerializer, ProjectSerializer,
    ClientSerializer, ContactSerializer, NewsletterSubscriberSerializer
)

User = get_user_model()

@api_view(['POST'])
@permission_classes([AllowAny])
def register_admin(request):
    admin_count = User.objects.filter(is_admin=True).count()
    if admin_count == 0:
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    if not request.user.is_authenticated or not request.user.is_superuser:
        return Response(
            {'error': 'Permission denied. Only existing superusers can create new admin accounts.'},
            status=status.HTTP_403_FORBIDDEN
        )
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_admin(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    if user and user.is_admin:
        refresh = RefreshToken.for_user(user)
        serializer = UserSerializer(user)
        return Response({
            'user': serializer.data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })
    return Response(
        {'error': 'Invalid credentials or not an admin'},
        status=status.HTTP_401_UNAUTHORIZED
    )

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [AllowAny]
        return [permission() for permission in permission_classes]

class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [AllowAny]
        return [permission() for permission in permission_classes]

class ContactViewSet(viewsets.ModelViewSet):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]
    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        if response.status_code == status.HTTP_201_CREATED:
            try:
                admin_email = getattr(settings, 'ADMIN_EMAIL', 'admin@example.com')
                send_mail(
                    subject=f'New Contact: {request.data.get("subject", "No Subject")}',
                    message=f'Name: {request.data.get("name")}\n'
                            f'Email: {request.data.get("email")}\n'
                            f'Mobile: {request.data.get("mobile", "N/A")}\n'
                            f'City: {request.data.get("city", "N/A")}\n'
                            f'Message: {request.data.get("message")}',
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[admin_email],
                    fail_silently=True,
                )
            except Exception as e:
                print(f"Email sending failed: {e}")
                pass
        return response

class NewsletterSubscriberViewSet(viewsets.ModelViewSet):
    queryset = NewsletterSubscriber.objects.all()
    serializer_class = NewsletterSubscriberSerializer
    def get_permissions(self):
        if self.action in ['create', 'unsubscribe']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]
    def create(self, request, *args, **kwargs):
        email = request.data.get('email')
        if not email:
            return Response({'email': ['This field is required.']}, status=status.HTTP_400_BAD_REQUEST)
        subscriber, created = NewsletterSubscriber.objects.get_or_create(
            email=email,
            defaults={'is_active': True}
        )
        if not created:
            if subscriber.is_active:
                return Response(
                    {'email': ['This email is already subscribed.']}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            else:
                subscriber.is_active = True
                subscriber.unsubscribed_at = None
                subscriber.save()
        return Response(
            {'message': 'Successfully subscribed to newsletter'},
            status=status.HTTP_201_CREATED
        )
    @action(detail=True, methods=['post'])
    def unsubscribe(self, request, pk=None):
        subscriber = self.get_object()
        subscriber.is_active = False
        subscriber.unsubscribed_at = timezone.now()
        subscriber.save()
        return Response({'message': 'Successfully unsubscribed'})