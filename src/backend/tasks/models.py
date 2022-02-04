from django.db import models
from classes.models import ClassModel
from account.models import Student
from django.contrib.auth.models import User
from proficiencies.models import Proficiency, ProficiencyLevel
from scores.models import ScoreInfomation


# Create your models here.


class TasksModel(models.Model):

    name = models.CharField(max_length=100)
    url = models.CharField(max_length=100)
    proficiency_id = models.ForeignKey(
        Proficiency, on_delete=models.CASCADE, related_name='Proficiency_id')

    def __str__(self):
        return str(self.id)


class TasksAssignedModel(models.Model):
    STATUS_NUMBERS = (
        ('0', 'Have not started'),
        ('1', 'In progress'),
        ('2', 'Done'),
    )
    task_id = models.ForeignKey(
        TasksModel, on_delete=models.CASCADE, related_name='Task')
    class_id = models.ForeignKey(
        ClassModel, on_delete=models.CASCADE, related_name='Class')
    assigned_student = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='Student')
    status = models.CharField(max_length=1, choices=STATUS_NUMBERS)
    scores_id = models.ForeignKey(
        ScoreInfomation, on_delete=models.CASCADE, related_name='Score_Prof_Info')
    due_date = models.DateField(default=None)


class AssessmentModel(models.Model):

    name = models.CharField(max_length=50)
    proficiency_id = models.ForeignKey(
        Proficiency, on_delete=models.CASCADE, related_name='P_id')
    next_assessment = models.CharField(max_length=50, default='N/A')
    prev_assessment = models.CharField(max_length=50, default='N/A')

    def __str__(self):
        return str(self.id)


class AssessmentAssignedModel(models.Model):
    STATUS_NUMBERS = (
        ('0', 'Have not started'),
        ('1', 'In progress'),
        ('2', 'Done'),
    )
    PROFICIENT = (
        ('0', 'Not Proficient'),
        ('1', 'Almost Proficient'),
        ('2', 'Proficient'),
    )

    assessment_id = models.ForeignKey(
        AssessmentModel, on_delete=models.CASCADE, related_name='Assessment')
    class_id = models.ForeignKey(
        ClassModel, on_delete=models.CASCADE, related_name='Class_id')
    assigned_student = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='Student_id')
    proficiency_id = models.ForeignKey(
        ProficiencyLevel, on_delete=models.CASCADE, default=0
    )
    status = models.CharField(max_length=1, choices=STATUS_NUMBERS)
    proficient = models.CharField(max_length=1, choices=PROFICIENT, default='0')
