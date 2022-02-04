from django.shortcuts import render
from rest_framework import viewsets, filters, generics
from rest_framework.response import Response
from .serializers import ScoreSerializer
from scores.models import ScoreInfomation

# Create your views here.


class ScoreAPIView(viewsets.ModelViewSet):
    serializer_class = ScoreSerializer
    queryset = ScoreInfomation.objects.all()
