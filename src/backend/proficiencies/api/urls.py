from django.urls import path, include
from .views import ProficiencyAPIView, StudentProficienciesAPIView, StandardsAPIView, StudentStandardsAPIView
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'Proficiencies', ProficiencyAPIView, 'Proficiencies')
router.register(r'MyProficiencies',
                StudentProficienciesAPIView, 'MyProficiencies')
router.register(r'Standards', StandardsAPIView, 'Standards')
router.register(r'MyStandards',
                StudentStandardsAPIView, 'MyStandards')

urlpatterns = [
    path('', include('knox.urls')),
    path('view', include(router.urls)),
]
