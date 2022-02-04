from django.urls import path, include
from .views import GradesAPIView
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'Grades', GradesAPIView, 'Grades')

urlpatterns = [
    path('', include('knox.urls')),
    path('view', include(router.urls)),
]
