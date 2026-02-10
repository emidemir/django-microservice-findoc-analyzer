from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
from django.conf import settings

from rest_framework_simplejwt.tokens import RefreshToken

import requests


User = get_user_model()


@api_view(['POST'])
@permission_classes([AllowAny])
def Oauth(request):
    # Get the JWT credential from the request
    credential = request.data.get('access_token')
    
    if not credential:
        return Response(
            {'error': 'access_token is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        # Verify the token with Google first
        verify_url = f'https://oauth2.googleapis.com/tokeninfo?id_token={credential}'
        verify_response = requests.get(verify_url)
        
        if verify_response.status_code != 200:
            return Response(
                {'error': 'Invalid Google token'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get user info from the verified token
        user_info = verify_response.json()
        
        # Extract user information
        email = user_info.get('email')
        first_name = user_info.get('given_name', '')
        last_name = user_info.get('family_name', '')
        email_verified = user_info.get('email_verified', 'false')
        
        # Convert email_verified to boolean (Google returns string "true"/"false")
        email_verified = email_verified == 'true' or email_verified == True
        
        # Security check: Make sure email is verified
        if not email_verified:
            return Response(
                {'error': 'Email not verified by Google'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not email:
            return Response(
                {'error': 'Email not provided by Google'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if user exists (LOGIN vs SIGNUP)
        try:
            user = User.objects.get(email=email)
            created = False
        except User.DoesNotExist:
            # Create new user (SIGNUP)
            user = User.objects.create_user(
                username=email,  # Use email as username
                email=email,
                first_name=first_name,
                last_name=last_name,
            )
            created = True
        
        # Generate YOUR JWT tokens (for authentication in your app)
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
            },
            'created': created
        }, status=status.HTTP_200_OK)
        
    except requests.exceptions.RequestException as e:
        return Response(
            {'error': f'Failed to verify token with Google: {str(e)}'},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {'error': f'Authentication failed: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([AllowAny])
def Signup(request):
    """Traditional email/password signup"""
    
    email = request.data.get('email')
    password = request.data.get('password')
    first_name = request.data.get('first_name', '')
    last_name = request.data.get('last_name', '')
    
    if not email or not password:
        return Response(
            {'error': 'Email and password are required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Check if user already exists
    if User.objects.filter(email=email).exists():
        return Response(
            {'error': 'User with this email already exists'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        # Validate password
        validate_password(password)
        
        # Create user
        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
        )
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
            }
        }, status=status.HTTP_201_CREATED)
        
    except ValidationError as e:
        return Response(
            {'error': e.messages},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['POST'])
@permission_classes([AllowAny])
def Login(request):
    """Traditional email/password login"""
    from django.contrib.auth import authenticate
    
    email = request.data.get('email')
    password = request.data.get('password')
    
    if not email or not password:
        return Response(
            {'error': 'Email and password are required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Try to get user by email
    try:
        user = User.objects.get(email=email)
        username = user.username
    except User.DoesNotExist:
        return Response(
            {'error': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    # Authenticate
    user = authenticate(username=username, password=password)
    
    if user is None:
        return Response(
            {'error': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    # Generate JWT tokens
    refresh = RefreshToken.for_user(user)
    
    return Response({
        'access': str(refresh.access_token),
        'refresh': str(refresh),
        'user': {
            'id': user.id,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
        }
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
def Logout(request):
    """
    Logout by blacklisting the refresh token.
    Note: You need to enable token blacklisting in settings.
    """
    try:
        refresh_token = request.data.get('refresh')
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
        return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)
    except Exception:
        return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)