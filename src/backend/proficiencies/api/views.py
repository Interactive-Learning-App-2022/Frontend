from rest_framework import viewsets
from rest_framework.response import Response

from .serializers import ProficiencySerializer, ProficiencyLevelSerializer, StandardLevelSerializer, StandardSerializer
from proficiencies.models import Proficiency, ProficiencyLevel, StandardLevel, StandardModel
# from classes.models import ClassModel
# from classes.serializers import ClassSerializer
from django.contrib.auth.models import User
from django.db.models import Q

from django.apps import apps
import json
import pdb
# Student = apps.get_model('account', 'Student')

# View all proficiencies in the database


class ProficiencyAPIView(viewsets.ModelViewSet):
    serializer_class = ProficiencySerializer
    queryset = Proficiency.objects.all()


class StudentProficienciesAPIViewTest(viewsets.ModelViewSet):
    lookup_field = 'student_id'
    serializer_class = ProficiencyLevel

    # Looks up student ID and returns all courses that student is enrolled in
    def get_queryset(self):
        if 'student_id' in self.kwargs:
            # Query user's classes
            query = ProficiencyLevel.objects.filter(
                student_id=self.kwargs['student_id'])
            return query.all()

        else:
            return ProficiencyLevel.objects.all()

    # Override retrieve class to allow for multiple results
    def retrieve(self, request, *args, **kwargs):
        serializer = self.get_serializer(self.get_queryset(), many=True)
        return Response(data=serializer.data)


class StudentProficienciesAPIView(viewsets.ModelViewSet):
    serializer_class = ProficiencyLevelSerializer
    queryset = ProficiencyLevel.objects.all()

    def get_queryset(self):
        if 'class' in self.request.GET and self.request.GET['class'] and 'prof' in self.request.GET and self.request.GET['prof']:
            classq = self.request.GET.get('class')
            profq = self.request.GET.get('prof')
            object_list = ProficiencyLevel.objects.filter(
                Q(class_id__id__icontains=classq) & Q(proficiency_id__id__icontains=profq))
            return object_list

        if 'class' in self.request.GET and self.request.GET['class']:
            classq = self.request.GET.get('class')
            object_list = ProficiencyLevel.objects.filter(
                Q(class_id__id__icontains=classq))
            return object_list
        
        if 'student' in self.request.GET and self.request.GET['student'] and 'prof' in self.request.GET and self.request.GET['prof']:
            studentq = self.request.GET.get('student')
            profq = self.request.GET.get('prof')
            object_list = ProficiencyLevel.objects.filter(
                Q(student_id__id__icontains=studentq) & Q(proficiency_id__id__icontains=profq))
            return object_list

        return ProficiencyLevel.objects.all()


class ClassProficiencyScoresAPIView(viewsets.ModelViewSet):
    lookup_field = 'class_id'
    serializer_class = ProficiencyLevel

    # Looks up class ID and returns all proficiencies associated with that class
    def get_queryset(self):
        if 'class_id' in self.kwargs:
            # Query user's classes
            #class_obj = ClassModel.objects.get(id=self.kwargs['class_id'])
            query = ProficiencyLevel.objects.filter()
            return query.all()

        else:
            return ProficiencyLevel.objects.all()

    # Override retrieve class to allow for multiple results
    def retrieve(self, request, *args, **kwargs):
        serializer = self.get_serializer(self.get_queryset(), many=True)
        return Response(data=serializer.data)

    
# method to retreive all Standard information. Will filter standards by grade and subject
class StandardsAPIView(viewsets.ModelViewSet):
    serializer_class = ProficiencySerializer
    queryset = Proficiency.objects.all()

    def get_queryset(self):     

        if 'grade' in self.request.GET and self.request.GET['grade']:
            gradeq = self.request.GET.get('grade')
            object_list = Proficiency.objects.filter(
                Q(grade__id__icontains=gradeq))
            return object_list

        # test to filter by subject
        if 'subject' in self.request.GET and self.request.GET['subject']:
            subjectq = self.request.GET.get('subject')
            object_list = Proficiency.objects.filter(
                Q(subject__id__icontains=subjectq))
            return object_list
        
        return Proficiency.objects.all()


# view to retreive specific student standardLevels by student id and class id
class StudentStandardsAPIView(viewsets.ModelViewSet):
    serializer_class = ProficiencyLevelSerializer
    queryset = ProficiencyLevel.objects.all()

    def get_queryset(self):

        if 'subject' in self.request.GET and self.request.GET['subject'] and 'student' in self.request.GET and self.request.GET['student']:
            subjectq = self.request.GET.get('subject')
            studentq = self.request.GET.get('student')
            object_list = ProficiencyLevel.objects.filter(
                Q(subject__id__icontains=subjectq) & Q(student_id__id__icontains=studentq))
            return object_list


        if 'subject' in self.request.GET and self.request.GET['subject']:
            subjectq = self.request.GET.get('subject')
            object_list = ProficiencyLevel.objects.filter(
                Q(subject__id__icontains=subjectq))
            return object_list


        