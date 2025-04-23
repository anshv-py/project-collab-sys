from django.shortcuts import render, redirect
from django.contrib import messages
from rest_framework import viewsets
from django.core.files.storage import FileSystemStorage
from django.core.mail import send_mail
from django.conf import settings
from bson.objectid import ObjectId
import hashlib
from pymongo import MongoClient
from datetime import datetime

from .models import Project
from .serializers import ProjectSerializer

client = MongoClient(
    "mongodb+srv://anshvahini16:Curet24.Nelll@agility-user-base.d7iwuyn.mongodb.net/",
    ssl=True)
db = client['project_db']
users_collection = db['authentication']
projects_collection = db['projects']
apply_collections = db['applications']

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def check_password(stored_password, entered_password):
    return hashlib.sha256(entered_password.encode('utf-8')).hexdigest() == stored_password

def auth_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        mode = request.POST.get('mode')  # 'login' or 'signup'
        role = request.POST.get('role')  # Student or Faculty
        
        # Handle Signup
        if mode == 'signup':
            salutation = request.POST.get('salutation')
            first_name = request.POST.get('first_name')
            last_name = request.POST.get('last_name')
            email = request.POST.get('email')
            domain = request.POST.getlist('selection')  # Get multiple domains
            confirm_password = request.POST.get('pass2')  # Only for signup

            if password != confirm_password:
                messages.error(request, "Passwords do not match")
                return redirect('auth')

            # Check if user already exists in MongoDB
            existing_user = users_collection.find_one({'username': username})
            if existing_user:
                messages.error(request, "Username already exists")
                return redirect('auth')

            # Hash the password before storing
            hashed_password = hash_password(password)

            # Insert the new user into the database
            users_collection.insert_one({
                'salutation': salutation,
                'fname': first_name,
                'lname': last_name,
                'username': username,
                'password': hashed_password,
                'role': role,
                'email': email,
                'domain': domain
            })

            messages.success(request, "Account created successfully. Please log in.")
            return redirect('auth')

        elif mode == 'login':
            user = users_collection.find_one({'username': username, 'role': role})
            if not user or not check_password(user['password'], password):  # Check if user exists and passwords match
                messages.error(request, "Invalid credentials")
                return redirect('auth')

            # Successful login, create a session
            request.session['user'] = username
            request.session['role'] = user['role']  # Store the role in session

            # Redirect based on user role
            if user['role'] == 'student':
                return redirect('student/dashboard/')
            elif user['role'] == 'faculty':
                return redirect('faculty/dashboard/')

    return render(request, 'signin.html')
class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

def home(request):
    return render(request, 'index.html')

def firstscreen(request):
    return render(request, 'loggedin.html')

def add_project(request):
    user_docs = users_collection.find({"role": "student"})
    user_names = [f"{user['fname']} {user['lname']} {user['username']}" for user in user_docs]
    if request.method == 'POST':
        name = request.POST.get('projectName')
        domain = request.POST.get('projectDomain')
        startDate = request.POST.get('projectStartDate')
        description = request.POST.get('projectDescription')
        count = request.POST.get('studentCount')
        students = request.POST.getlist('students[]')

        image = request.FILES.get('projectImage')
        image_url = ""

        if image:
            fs = FileSystemStorage()
            filename = fs.save(image.name, image)
            image_url = fs.url(filename)

        if not all([name, domain, startDate, description, count, students]):
            messages.error(request, "All fields are required.")
            return redirect('/faculty/dashboard/')

        username = request.session.get('user')
        faculty = users_collection.find_one({'username': username})
        projects_collection.insert_one({
            'name': name,
            'domain': domain,
            'date': startDate,
            'faculty_user': username,
            'faculty_name': faculty['salutation'] + " " + faculty['fname'] + " " + faculty['lname'],
            'description': description,
            'image': image_url,
            'count': count,
            'students': students,
            'status': 'open'
        })

        messages.success(request, "Project added successfully.")
        return redirect('/faculty/dashboard/')
    
    return render(request, "addProject.html", {"user_names": user_names})

def apply_to_project(request, project_id):
    print(f"Project ID: {project_id}")
    if request.method == "POST":
        username = request.session.get('user')
        resume = request.FILES['resume']
        student = users_collection.find_one({'username': username})
        student_email = student['email']
        fs = FileSystemStorage()
        filename = fs.save(resume.name, resume)
        file_url = fs.url(filename)
        student_name = f"{student['fname']} {student['lname']}"
        project = projects_collection.find_one({"_id": ObjectId(project_id)})

        if apply_collections.find_one({'student_name': student_name, 'project_id': str(project['_id'])}):
            messages.error(request, "You have already applied to this Project!")
            return redirect('student_dashboard')
        if project:
            username = project.get('faculty_user')
            faculty = users_collection.find_one({"username": username})
            faculty_email = faculty['email']
        else:
            return
        
        # Save application in MongoDB
        apply_collections.insert_one({
            "date": datetime.utcnow(),
            "student_name": student_name,
            "student_email": student_email,
            "project_id": str(project['_id']),
            "project_title": project['name'],
            "faculty_email": faculty_email,
            "resume": file_url,
            'status': 'applied'
        })

        messages.success(request, "Application submitted successfully.")
        return redirect('/student/dashboard/')

    return redirect('/student/dashboard/')

def student_dashboard(request):
    projects = list(projects_collection.find().sort("date", -1))
    user = request.session.get('user')
    email = users_collection.find_one({'username': user})['email']
    for project in projects:
        project['id'] = str(project['_id'])
    return render(request, 'student_dashboard.html', {'projects': projects, 'email': email})

def wishlist_view(request):
    print("VIEW HIT")
    student = users_collection.find_one({'username': request.session.get('user')})
    student_email = student['email']
    applied_projects = apply_collections.find({
        'student_email': student_email,
        'status': 'applied'
    })
    project_ids = [ObjectId(app['project_id']) for app in applied_projects]
    projects = list(projects_collection.find({'_id': {'$in': project_ids}}))
    print(len(projects))

    for project in projects:
        project['id'] = str(project['_id'])

    return render(request, 'myProjectsStu.html', {'projects': projects})

def faculty_dashboard(request):
    all_projects = list(projects_collection.find().sort("date", -1))
    for project in all_projects:
        project['id'] = str(project['_id'])
    return render(request, "faculty_dashboard.html", {"projects": all_projects})

def my_projects(request):
    username = request.session.get('user')
    user = users_collection.find_one({'username': username})
    if user['role'] == "faculty":
        return render(request, 'myProjectsFac.html')
    else:
        return render(request, 'myProjectsStu.html')

def calendar(request):
    return render(request, 'tasksDeadlines.html')

def profile_page(request):
    username = request.session.get('user')
    if not username:
        return redirect('auth')

    user = users_collection.find_one({'username': username})

    if request.method == 'POST':
        email = request.POST.get('email')
        phone = request.POST.get('phone')
        address = request.POST.get('address')
        users_collection.update_one({'username': username}, {'$set': {
            'email': email,
            'phone': phone,
            'address': address
        }})
        messages.success(request, "Profile updated successfully")
        return redirect('student_dashboard-profile' if user['role'] == 'student' else 'faculty_dashboard-profile')

    return render(request, 'profile.html', {'user': user})
