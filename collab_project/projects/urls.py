from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet, home, signin, firstscreen, student_dashboard, faculty_dashboard, profile_page

# DRF Router for API endpoints
router = DefaultRouter()
router.register(r'projects', ProjectViewSet)

urlpatterns = [
    path('', home, name='home'),
    path('auth/', signin, name='auth'),
    path('home/', firstscreen, name='first'),
    path('student/dashboard/', student_dashboard, name='student_dashboard'),
    path('home/student/dashboard/', student_dashboard, name='home-student_dashboard'),
    path('faculty/dashboard/', faculty_dashboard, name='faculty_dashboard'),
    path('home/faculty/dashboard/', faculty_dashboard, name='home-faculty_dashboard'),
    path('student/dashboard/profile/', profile_page, name='student_dashboard-profile'),
    path('home/student/dashboard/profile/', profile_page, name='home-student_dashboard-profile'),
    path('faculty/dashboard/profile/', profile_page, name='faculty_dashboard-profile'),
    path('home/faculty/dashboard/profile/', profile_page, name='home-faculty_dashboard-profile'),
]
