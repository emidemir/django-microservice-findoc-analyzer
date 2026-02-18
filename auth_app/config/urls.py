from django.contrib import admin
from django.urls import path

from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView,TokenVerifyView
from users.views import Login, Logout, Oauth, Signup, ValidateTokenView

urlpatterns = [
    path('admin/', admin.site.urls),
    # USER ENDPOINTS
    path('login/', Login, name='login'),
    path('logout/', Logout, name='logout'),
    path('signup/', Signup, name='signup'),
    path('oauth/', Oauth, name='oauth'),
    path('validate/', ValidateTokenView.as_view(), name='auth_validate'),

    # JWT ENDPONTS
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
]
