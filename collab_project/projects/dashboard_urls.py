from django.urls import path
from .views import student_dashboard, faculty_dashboard, profile_page, add_project, my_projects, calendar, apply_to_project, wishlist_view

dashboard_patterns = [
    path('student/dashboard/', student_dashboard, name='student_dashboard'),
    path('student/dashboard/profile/', profile_page, name='student_dashboard-profile'),
    path('student/dashboard/my_projects/', my_projects, name='student_dashboard-my-projects'),
    path('student/dashboard/calendar/', calendar, name='student_dashboard-calendar'),
    path('faculty/dashboard/', faculty_dashboard, name='faculty_dashboard'),
    path('faculty/dashboard/profile/', profile_page, name='faculty_dashboard-profile'),
    path('faculty/dashboard/add_project/', add_project, name='faculty_dashboard-add-project'),
    path('faculty/dashboard/my_projects/', my_projects, name='faculty_dashboard-my-projects'),
    path('faculty/dashboard/calendar/', calendar, name='faculty_dashboard-calendar'),
    path('apply/<str:project_id>/', apply_to_project, name='apply_to_project'),
    path('student/dashboard/applied', wishlist_view, name='wishlist'),

]
