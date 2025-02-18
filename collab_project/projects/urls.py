from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet, login_view, signup_view, dashboard, logout_view

# DRF Router for API endpoints
router = DefaultRouter()
router.register(r'projects', ProjectViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('login/', login_view, name='login'),
    path('signup/', signup_view, name='signup'),
    path('dashboard/', dashboard, name='dashboard'),
    path('logout/', logout_view, name='logout'),
]
