"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from .views import AuthProxy, WorkerProxy

urlpatterns = [
    path('admin/', admin.site.urls),
    # Auth Routes -> Redirects to Auth Service
    path('auth/<str:path>/', AuthProxy.as_view(), name='auth-app-proxy'),
    
    # Media Routes -> Redirects to Worker Service
    # https://github.com/emidemir/django-microservice-aiapi-image-editor/blob/main/backend/1-gateway-service/config/urls.py
    path('worker/<path:path>/', WorkerProxy.as_view() ,name='worker-app-proxy'),
]
