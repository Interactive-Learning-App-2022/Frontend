from django.urls import path, include
from .views import ScoreAPIView
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'ScoreInfo', ScoreAPIView, 'ScoreInfo')

urlpatterns = [
    path('', include('knox.urls')),
    path('view', include(router.urls)),
]
