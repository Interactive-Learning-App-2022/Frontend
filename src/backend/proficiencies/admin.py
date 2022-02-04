from django.contrib import admin
from .models import Proficiency, ProficiencyLevel, StandardModel, StandardLevel

# Register your models here.


class ProficienciesAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'grade', 'subject', 'standard', 'description')


class ProficiencyLevelsAdmin(admin.ModelAdmin):
    list_display = ('id', 'student_id', 'class_id', 'subject',
                    'proficiency_id', 'scores_id', 'proficient')

class StandardsAdmin(admin.ModelAdmin):
    list_display = ('id', 'standard_name', 'grade', 'subject', 'next_standard', 'next_standardID', 'prev_standard', 'prev_standardID')

class StandardLevelsAdmin(admin.ModelAdmin):
    list_display = ('student_id', 'class_id', 'subject', 'grade', 'standard_id', 'proficiency_id',  'proficient')

admin.site.register(Proficiency, ProficienciesAdmin)
admin.site.register(ProficiencyLevel, ProficiencyLevelsAdmin)
admin.site.register(StandardModel, StandardsAdmin)
admin.site.register(StandardLevel, StandardLevelsAdmin)