from django.db import models
from django.contrib.auth.models import User

class Faculty(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    department = models.CharField(max_length=100)
    expertise = models.TextField()

class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    resume = models.FileField(upload_to='resumes/')
    xp_points = models.IntegerField(default=0)
    skills = models.TextField()

class Project(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    faculty = models.ForeignKey(Faculty, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    deadline = models.DateTimeField()
    selection_method = models.CharField(
        max_length=20,
        choices=[('FCFS', 'First Come First Serve'), ('RESUME', 'Resume Based')]
    )
    status = models.CharField(
        max_length=20,
        choices=[('OPEN', 'Open'), ('IN_PROGRESS', 'In Progress'), ('COMPLETED', 'Completed')]
    )

class ProjectApplication(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    status = models.CharField(
        max_length=20,
        choices=[('PENDING', 'Pending'), ('ACCEPTED', 'Accepted'), ('REJECTED', 'Rejected')]
    )
    applied_at = models.DateTimeField(auto_now_add=True)

class Task(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField()
    deadline = models.DateTimeField()
    status = models.CharField(
        max_length=20,
        choices=[('TODO', 'To Do'), ('IN_PROGRESS', 'In Progress'), ('COMPLETED', 'Completed')]
    )
    assigned_to = models.ManyToManyField(Student)

class Meeting(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    datetime = models.DateTimeField()
    location = models.CharField(max_length=200)
    participants = models.ManyToManyField(User)

class Message(models.Model):
    sender = models.ForeignKey(User, related_name='sent_messages', on_delete=models.CASCADE)
    receiver = models.ForeignKey(User, related_name='received_messages', on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
