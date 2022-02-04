from django.db import models
from django.contrib.auth.models import User
from django.db.models.deletion import CASCADE
from grades.models import GradeModel
from classes.models import ClassModel, SubjectModel
from scores.models import ScoreInfomation

# Create your models here.


class StandardModel(models.Model):
    # readable name for the standard
    standard_name = models.CharField(max_length=20)
    # grade for the standard
    grade = models.ForeignKey(
        GradeModel, on_delete=models.CASCADE, related_name='StandardGrade')
    subject = models.ForeignKey(
        SubjectModel, on_delete=models.CASCADE)
    # id of next standard in the list
    next_standard = models.CharField(max_length=20)
    next_standardID = models.CharField(max_length=20)
    # id of the prev standard in the list
    prev_standard = models.CharField(max_length=20)
    prev_standardID = models.CharField(max_length=20)


    def __str__(self):
        return str(self.standard_name)
    

# Master list of all proficiencies with relevant information to the profeciency
class Proficiency(models.Model):
    # e.g. MATH-5.NF.1 for 5th grade math fractions
    name = models.CharField(max_length=20)
    grade = models.ForeignKey(
        GradeModel, on_delete=models.CASCADE, related_name='Grade')
    subject = models.ForeignKey(
        SubjectModel, on_delete=models.CASCADE)  # Subject, e.g. Math
    # Short description on what the proficiency is
    description = models.TextField(max_length=255)
    long_description = models.TextField(max_length=4096, null=True, blank=True)
    standard = models.ForeignKey(
        StandardModel, on_delete=CASCADE, default=1, 
    )

    def __str__(self):
        return str(self.id)


# Relationship between students and standards to store whether or not 
# the student is proficient in a given standard
class StandardLevel(models.Model):
 
    PROFICIENT = (
        ('0', 'Not Proficient'),
        ('1', 'Almost Proficient'),
        ('2', 'Proficient'),
    )

    student_id = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='Standard_Student_Info')
    class_id = models.ForeignKey(
        ClassModel, on_delete=models.CASCADE, related_name='Standard_Class_Info')
    grade = models.ForeignKey(
        GradeModel, on_delete=models.CASCADE, related_name='Standard_Grade', default=1)
    subject = models.ForeignKey(
        SubjectModel, on_delete=models.CASCADE, default=1)    
    standard_id = models.ForeignKey(
        StandardModel, on_delete=models.CASCADE, related_name='Standard_ID', default=1
    )
    proficiency_id = models.ForeignKey(
        Proficiency, on_delete=models.CASCADE, related_name='Standard_Proficiency_Info')
    proficient = models.CharField(max_length=1, choices=PROFICIENT, default='0')

    def __str__(self):
        return str(self.id)

# Relationship between students and proficiencies to store whether or not
# the student is proficient in a given proficiency
class ProficiencyLevel(models.Model):
    
    PROFICIENT = (
        ('0', 'Not Proficient'),
        ('1', 'Almost Proficient'),
        ('2', 'Proficient'),
    )

    student_id = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='Student_Info')
    class_id = models.ForeignKey(
        ClassModel, on_delete=models.CASCADE, related_name='Class_Info')
    subject = models.ForeignKey(
        SubjectModel, on_delete=models.CASCADE, default=1)
    proficiency_id = models.ForeignKey(
        Proficiency, on_delete=models.CASCADE, related_name='Proficiency_Info')
    scores_id = models.ForeignKey(
        ScoreInfomation, on_delete=models.CASCADE, related_name='Score_Info')
    proficient = models.CharField(max_length=1, choices=PROFICIENT, default='0')

    def __str__(self):
        return str(self.id)