from django.db import models
from django.contrib.auth.models import User
from grades.models import GradeModel


# Create your models here.

class SubjectModel(models.Model):
    subject = models.CharField(max_length=30)
        
    def __str__(self):
        return str(self.subject)

# Model to hold list of all available classes
class ClassModel(models.Model):
    grade = models.ForeignKey(
        GradeModel, on_delete=models.CASCADE, related_name='grade')
    subject = models.ForeignKey(
        SubjectModel, on_delete=models.CASCADE, default=1)
    teacher_id = models.IntegerField()
    starts_at = models.TimeField()
    ends_at = models.TimeField()
    school = models.CharField(max_length=255)
    room = models.TextField(max_length=255)

    def __str__(self):
        return str(self.id)


# Model to tie together which classes a student is taking
class CourseEnrollment(models.Model):
    student_id = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='courses')

    class_id = models.ForeignKey(
        ClassModel, on_delete=models.CASCADE, related_name='students')

    def __str__(self):
        return f'Student: {self.student_id.username}, Class: {self.class_id}'