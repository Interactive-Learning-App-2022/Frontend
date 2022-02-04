from django.contrib import admin
from .models import ClassModel, CourseEnrollment, SubjectModel

# Register your models here.

class SubjectAdmin(admin.ModelAdmin):
    list_display = ('id', 'subject')


class ClassesAdmin(admin.ModelAdmin):
    list_display = ('id', 'grade', 'subject', 'teacher_id',
                    'starts_at', 'ends_at', 'school', 'room')


class CourseEnrollmentAdmin(admin.ModelAdmin):
    list_display = ('student_id', 'class_id')


admin.site.register(ClassModel, ClassesAdmin)
admin.site.register(CourseEnrollment, CourseEnrollmentAdmin)
admin.site.register(SubjectModel, SubjectAdmin)