from django.shortcuts import render
from rest_framework import viewsets, filters, generics
from rest_framework.response import Response
from classes.models import ClassModel
from .serializers import AssessmentsAssignedSerializer, TaskSerializer, TasksAssignedSerializer, TasksAssignedCreator, AssessmentsAssignedCreator, AssessmentSerializer
from tasks.models import AssessmentAssignedModel, TasksModel, ScoreInfomation, TasksAssignedModel, AssessmentModel
from django.contrib.auth.models import User
from django.db.models import Q, query


# Create your views here.


class TaskAPIView(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    model = TasksModel

    def get_queryset(self):
        if 'proficiency_id' in self.request.GET and self.request.GET['proficiency_id']:
            profq = self.request.GET.get('proficiency_id')
            object_list = TasksModel.objects.filter(
                Q(proficiency_id__id__icontains=profq))
            return object_list
        return TasksModel.objects.all()


class TasksAssignedAPIView(viewsets.ModelViewSet):
    serializer_class = TasksAssignedSerializer
    model = TasksAssignedModel

    def get_queryset(self):
        if 'class' in self.request.GET and self.request.GET['class'] and 'user' in self.request.GET and self.request.GET['user']:
            classq = self.request.GET.get('class')
            userq = self.request.GET.get('user')
            object_list = TasksAssignedModel.objects.filter(
                Q(class_id__id__icontains=classq) & Q(assigned_student__id__icontains=userq))
            return object_list
        if 'class' in self.request.GET and self.request.GET['class']:
            query = self.request.GET.get('class')
            object_list = TasksAssignedModel.objects.filter(
                Q(class_id__id__icontains=query))
            return object_list
        if 'student' in self.request.GET and self.request.GET['student']:
            query = self.request.GET.get('student')
            object_list = TasksAssignedModel.objects.filter(
                Q(assigned_student__id__icontains=query))
            return object_list

        return TasksAssignedModel.objects.all()


class ScoreUpdateAPI(viewsets.ModelViewSet):
    serializer_class = TasksAssignedSerializer
    model = TasksAssignedModel

    def get_queryset(self):
        if 'class' in self.request.GET and self.request.GET['class'] and 'user' in self.request.GET and self.request.GET['user'] and 'score' in self.request.GET and self.request.GET['score']:
            classq = self.request.GET.get('class')
            userq = self.request.GET.get('user')
            scoreq = self.request.GET.get('score')
            object_list = TasksAssignedModel.objects.filter(
                Q(class_id__id__icontains=classq) & Q(assigned_student__id__icontains=userq))


class AssignNewTask(viewsets.ModelViewSet):
    queryset = TasksAssignedModel.objects.all()
    serializer_class = TasksAssignedCreator


class StartTaskAPI(generics.RetrieveUpdateDestroyAPIView):
    queryset = TasksAssignedModel.objects.all()
    serializer_class = TasksAssignedSerializer

# view to assign new assessment
class AssignNewAssessment(viewsets.ModelViewSet):
    queryset = AssessmentAssignedModel.objects.all()
    serializer_class = AssessmentsAssignedCreator


class AssessmentView(viewsets.ModelViewSet):
    serializer_class = AssessmentSerializer
    model = AssessmentModel

    def get_queryset(self):
        if 'proficiency_id' in self.request.GET and self.request.GET['proficiency_id']:
            profq = self.request.GET.get('proficiency_id')
            object_list = AssessmentModel.objects.filter(
                Q(proficiency_id__id__icontains=profq))
            return object_list
        
        return AssessmentModel.objects.all()

class AssessmentAssignedAPIView(viewsets.ModelViewSet):
    serializer_class = AssessmentsAssignedSerializer
    model = AssessmentAssignedModel

    def get_queryset(self):
        if 'class' in self.request.GET and self.request.GET['class'] and 'user' in self.request.GET and self.request.GET['user']:
            classq = self.request.GET.get('class')
            userq = self.request.GET.get('user')
            object_list = AssessmentAssignedModel.objects.filter(
                Q(class_id__id__icontains=classq) & Q(assigned_student__id__icontains=userq))
            return object_list

        if 'id' in self.request.GET and self.request.GET['id']:
            idq = self.request.GET.get('id')
            object_list = AssessmentAssignedModel.objects.filter(
                Q(id__icontains=idq))
            return object_list

        return AssessmentAssignedModel.objects.all()