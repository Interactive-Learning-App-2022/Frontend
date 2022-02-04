from django.contrib import admin
from .models import TasksModel, ScoreInfomation, TasksAssignedModel, AssessmentModel, AssessmentAssignedModel

# Register your models here.


class TasksAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'proficiency_id', 'url')


class TasksAssignedAdmin(admin.ModelAdmin):
    list_display = ('task_id', 'class_id',
                    'assigned_student', 'scores_id', 'status')

class AssessmentsAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'proficiency_id', 'next_assessment', 'prev_assessment')

class AssessmentsAssignedAdmin(admin.ModelAdmin):
    list_display = ('id', 'assessment_id', 'class_id',
                    'assigned_student', 'proficiency_id','status', 'proficient')

admin.site.register(TasksModel, TasksAdmin)
admin.site.register(TasksAssignedModel, TasksAssignedAdmin)
admin.site.register(AssessmentModel, AssessmentsAdmin)
admin.site.register(AssessmentAssignedModel, AssessmentsAssignedAdmin)
