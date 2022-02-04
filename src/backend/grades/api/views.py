from django.shortcuts import render
from rest_framework import viewsets, filters, generics
from rest_framework.response import Response
from .serializers import GradeSerializer
from grades.models import GradeModel

# Create your views here.


class GradesAPIView(viewsets.ModelViewSet):
    serializer_class = GradeSerializer
    queryset = GradeModel.objects.all()
