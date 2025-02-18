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

# Authentication Views
def login_view(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")
        user = authenticate(username=username, password=password)

        if user is not None:
            login(request, user)
            print(user.profile.user_type)

            if user.profile.user_type == "faculty" or user.profile.user_type == "Faculty":
                return redirect("/faculty_dashboard/")
            else:
                return redirect("/student_dashboard/")
    return render(request, "projects/login.html", {"error": "Invalid credentials"})

def signup_view(request):
    if request.method == "POST":
        username = request.POST.get("username")
        email = request.POST.get("email")
        password = request.POST.get("password")
        user_type = request.POST.get("user_type")

        # Check if the user already exists
        if User.objects.filter(username=username).exists():
            return JsonResponse({"error": "Username already taken. Choose another."}, status=400)

        user = User.objects.create_user(username=username, email=email, password=password)
        return JsonResponse({"message": "User created successfully!"})
    return render(request, 'projects/signup.html')


def dashboard(request):
    if request.user.profile.user_type == "faculty" or request.user.profile.user_type == "Faculty":
        projects = Project.objects.filter(faculty=request.user.faculty)
        return render(request, 'projects/faculty_dashboard.html', {'projects': projects})
    else:
        projects = Project.objects.all()
        return render(request, 'projects/student_dashboard.html', {'projects': projects})

def logout_view(request):
    logout(request)
    return redirect('login.html')
