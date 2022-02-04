from django.urls import path, include

from .views import ClassesAPIView, CourseEnrollmentAPIView, CourseProficiencyAPIView, \
    StudentsInClassAPIView, CourseProficiencyAggAPIView

from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'Classes', ClassesAPIView, 'Classes')
router.register(r'CourseEnrollment',
                CourseEnrollmentAPIView, 'CourseEnrollment')
router.register(r'CourseProficiency',
                CourseProficiencyAPIView, 'CourseProficiency')
router.register(r'AggCourseProficiency',
                CourseProficiencyAggAPIView, 'AggCourseProficiency')
router.register(r'StudentsInClass',
                StudentsInClassAPIView, 'StudentsInClass')

urlpatterns = [
    path('', include('knox.urls')),
    path('view', include(router.urls)),
]
