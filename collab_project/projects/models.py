from django.db import models
from django.contrib.auth.models import User

class Faculty(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    department = models.CharField(max_length=100)
    expertise = models.CharField(max_length=255, default='Not Specified')

    def __str__(self):
        return f"{self.user.username} - {self.department}"

class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    resume = models.FileField(upload_to='resumes/', null=True, blank=True)
    xp_points = models.IntegerField(default=0)
    skills = models.TextField()
    year_of_study = models.IntegerField()
    
    def __str__(self):
        return self.user.username

class Project(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    faculty = models.ForeignKey(Faculty, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    deadline = models.DateTimeField()
    selection_method = models.CharField(
        max_length=20,
        choices=[('FCFS', 'First Come First Serve'), ('RESUME', 'Resume Based')],
        default='FCFS'
    )
    status = models.CharField(
        max_length=20,
        choices=[('OPEN', 'Open'), ('IN_PROGRESS', 'In Progress'), ('COMPLETED', 'Completed')],
        default='OPEN'
    )
    max_students = models.IntegerField(default=1)
    required_skills = models.TextField()

    def __str__(self):
        return self.title

class ProjectApplication(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    status = models.CharField(
        max_length=20,
        choices=[('PENDING', 'Pending'), ('ACCEPTED', 'Accepted'), ('REJECTED', 'Rejected')],
        default='PENDING'
    )
    applied_at = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True)

    class Meta:
        unique_together = ('student', 'project')

class Profile(models.Model):
    USER_TYPES = [
        ('faculty', 'Faculty'),
        ('student', 'Student'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    user_type = models.CharField(max_length=10, choices=USER_TYPES)

    def __str__(self):
        return f"{self.user.username} - {self.user_type}"

class Task(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    deadline = models.DateTimeField()
    status = models.CharField(
        max_length=20,
        choices=[('TODO', 'To Do'), ('IN_PROGRESS', 'In Progress'), ('COMPLETED', 'Completed')],
        default='TODO'
    )
    assigned_to = models.ManyToManyField(Student)
    priority = models.CharField(
        max_length=20,
        choices=[('LOW', 'Low'), ('MEDIUM', 'Medium'), ('HIGH', 'High')],
        default='MEDIUM'
    )

    def __str__(self):
        return self.title

class Meeting(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField()
    datetime = models.DateTimeField()
    location = models.CharField(max_length=200)
    meeting_type = models.CharField(
        max_length=20,
        choices=[('DISCUSSION', 'Discussion'), ('REVIEW', 'Review'), ('MILESTONE', 'Milestone')],
        default='DISCUSSION'
    )
    participants = models.ManyToManyField(User)
    
    def __str__(self):
        return f"{self.title} - {self.datetime.strftime('%Y-%m-%d %H:%M')}"

class Message(models.Model):
    sender = models.ForeignKey(User, related_name='sent_messages', on_delete=models.CASCADE)
    receiver = models.ForeignKey(User, related_name='received_messages', on_delete=models.CASCADE)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"Message from {self.sender} to {self.receiver} at {self.timestamp.strftime('%Y-%m-%d %H:%M')}"

class Milestone(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField()
    due_date = models.DateTimeField()
    completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)
    xp_reward = models.IntegerField(default=0)

    def __str__(self):
        return self.title