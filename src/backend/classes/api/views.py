from functools import cmp_to_key
from rest_framework import viewsets
from rest_framework.response import Response

from .serializers import ClassSerializer, CourseEnrollmentSerializer
from classes.models import ClassModel, CourseEnrollment
from proficiencies.models import Proficiency, ProficiencyLevel
from proficiencies.api.serializers import ProficiencySerializer, ProficiencyLevelSerializer
from django.contrib.auth.models import User
from django.db.models import Q

from django.apps import apps
Student = apps.get_model('account', 'Student')


class ClassesAPIView(viewsets.ModelViewSet):
    serializer_class = ClassSerializer
    queryset = ClassModel.objects.all()
    
    def get_queryset(self):
        if 'class' in self.request.GET and self.request.GET['class']:
            classq = self.request.GET.get('class')
            object_list = ClassModel.objects.filter(
                Q(id__icontains=classq)
            )
            return object_list
        return ClassModel.objects.all()    

class CourseEnrollmentAPIView(viewsets.ModelViewSet):
    lookup_field = 'student_id'
    serializer_class = CourseEnrollmentSerializer

    # Looks up student ID and returns all courses that student is enrolled in
    def get_queryset(self):
        if 'student_id' in self.kwargs:
            # Query user's classes
            query = CourseEnrollment.objects.filter(
                student_id=self.kwargs['student_id'])
            return query.all()

        else:
            return CourseEnrollment.objects.all()

    # Override retrieve class to allow for multiple results
    def retrieve(self, request, *args, **kwargs):
        serializer = self.get_serializer(self.get_queryset(), many=True)
        return Response(data=serializer.data)


class StudentsInClassAPIView(viewsets.ModelViewSet):
    serializer_class = CourseEnrollmentSerializer
    model = CourseEnrollment

    def get_queryset(self):
        if 'class' in self.request.GET and self.request.GET['class']:
            classq = self.request.GET.get('class')
            object_list = CourseEnrollment.objects.filter(
                Q(class_id__id__icontains=classq))
            return object_list
        return CourseEnrollment.objects.all()


class CourseProficiencyAPIView(viewsets.ModelViewSet):
    lookup_field = 'class_id'
    serializer_class = ProficiencyLevelSerializer

    # Looks up class ID
    def get_queryset(self):
        if 'class_id' in self.kwargs:
            # Query for class id which is passed in parameter
            class_obj = ClassModel.objects.get(id=self.kwargs['class_id'])

            # Use spanning relationship lookup to bring in proficieny levels and the information about the proficiency
            return ProficiencyLevel.objects.filter(proficiency_id__grade=class_obj.grade, proficiency_id__subject=class_obj.subject.upper()).all()

        else:
            return ProficiencyLevel.objects.all()

    # Override retrieve class to allow for multiple results
    def retrieve(self, request, *args, **kwargs):
        serializer = self.get_serializer(self.get_queryset(), many=True)
        return Response(data=serializer.data)


class CourseProficiencyAggAPIView(viewsets.ModelViewSet):
    lookup_field = 'class_id'
    serializer_class = ProficiencyLevelSerializer

    # Looks up class ID
    def get_queryset(self):
        if 'class_id' in self.kwargs:
            # Query for class id which is passed in parameter
            class_obj = ClassModel.objects.get(id=self.kwargs['class_id'])

            # Use spanning relationship lookup to bring in proficieny levels and the information about the proficiency
            all_proficiencies = ProficiencyLevel.objects.filter(
                proficiency_id__grade=class_obj.grade, proficiency_id__subject=class_obj.subject.upper())
            # return all_proficiencies.all()
            scores = {}

            for p in all_proficiencies:
                if p.proficiency_id.id not in scores.keys():
                    scores[p.proficiency_id.id] = {'p': 0, 'ap': 0, 'np': 0}

                return scores

                # if p.is_proficient == '0':
                #    scores[p.proficiency_id.id]['p'] += 1
                # else:
                #    scores[p.proficiency_id.id]['np'] += 1

            return scores

        else:
            return None

    # Override retrieve class to allow for multiple results
    def retrieve(self, request, *args, **kwargs):
        serializer = self.get_serializer(self.get_queryset(), many=True)
        return Response(data=serializer.data)
