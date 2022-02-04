from django.db import models

# Create your models here.


class ScoreInfomation(models.Model):
    PROFICIENCY_NUMBERS = (
        ('0', 'Proficient'),
        ('1', 'Almost Proficient'),
        ('2', 'Non-Proficient'),
    )
    ORGINAL_PROFICIENCY_NUMBERS = (
        ('0', 'Proficient'),
        ('1', 'Non-Proficient'),
    )
    orginal_proficient = models.CharField(
        max_length=1, choices=ORGINAL_PROFICIENCY_NUMBERS)
    currentscore = models.IntegerField(default=0)
    is_proficient = models.CharField(max_length=1, choices=PROFICIENCY_NUMBERS)

    def __str__(self):
        return str(self.id)
