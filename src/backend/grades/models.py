from django.db import models

# Create your models here.


class GradeModel(models.Model):
    gradenumber = models.CharField(max_length=256)

    def __str__(self):
        return str(self.gradenumber)
