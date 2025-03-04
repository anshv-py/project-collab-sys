from django.shortcuts import render, redirect
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.models import User
from django.contrib import messages
from rest_framework import viewsets
from django.http import JsonResponse

from .models import Faculty, Project, Profile
from .serializers import FacultySerializer, ProjectSerializer

# Existing DRF API ViewSet
class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

def home(request):
    return render(request, 'index.html')

# Authentication Views
def signin(request):
    return render(request, 'signin.html')

def firstscreen(request):
    return render(request, 'index2.html')

def dashboard(request):
    return render(request, 'faculty-projects.html')

def logout_view(request):
    logout(request)
    return redirect('login.html')
