from django.contrib import admin
from .models import ScoreInfomation
# Register your models here.


class ScoreAdmin(admin.ModelAdmin):
    list_display = ('id', 'orginal_proficient',
                    'currentscore', 'is_proficient')


admin.site.register(ScoreInfomation, ScoreAdmin)
