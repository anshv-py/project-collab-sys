from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet, home, signin, firstscreen, dashboard, logout_view

# DRF Router for API endpoints
router = DefaultRouter()
router.register(r'projects', ProjectViewSet)

urlpatterns = [
    path('', home, name='home'),
    path('auth/', signin, name='auth'),
    path('home/', firstscreen, name='first')
]
