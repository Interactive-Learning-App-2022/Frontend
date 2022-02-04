from django.contrib import admin
from .models import GradeModel

# Register your models here.


class GradeAdmin(admin.ModelAdmin):
    list_display = ('id', 'gradenumber')


admin.site.register(GradeModel, GradeAdmin)
