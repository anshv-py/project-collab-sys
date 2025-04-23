from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet, home, auth_view, firstscreen
from . import dashboard_urls

# DRF Router for API endpoints
router = DefaultRouter()
router.register(r'projects', ProjectViewSet)


urlpatterns = [
    path('', home, name='home'),
    path('auth/', auth_view, name='auth'),
    path('home/', firstscreen, name='first'),

    *dashboard_urls.dashboard_patterns,

    path('home/', include((dashboard_urls.dashboard_patterns, 'home'))),
    path('auth/', include((dashboard_urls.dashboard_patterns, 'auth'))),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)