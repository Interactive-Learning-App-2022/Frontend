from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class Student(models.Model):
    username = models.CharField(max_length=50)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)

    def __str__(self):
        return self.username
