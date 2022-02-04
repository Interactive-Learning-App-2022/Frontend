from django.urls import path, include
from .views import TaskAPIView, TasksAssignedAPIView, AssignNewTask, AssignNewAssessment, AssessmentView, AssessmentAssignedAPIView
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'Tasks', TaskAPIView, 'Tasks')
router.register(r'AssignedTasks', TasksAssignedAPIView, 'AssignedTasks')
router.register(r'AssignNewTask', AssignNewTask, 'AssignNewTask')
router.register(r'Assessments', AssessmentView, 'Assessments')
router.register(r'AssignedAssessments', AssessmentAssignedAPIView, 'AssignedAssessments')
router.register(r'AssignNewAssessment', AssignNewAssessment, 'AssignNewAssessment')

urlpatterns = [
    path('', include('knox.urls')),
    path('view', include(router.urls)),
]
