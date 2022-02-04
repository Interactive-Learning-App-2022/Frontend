from rest_framework import serializers
from grades.models import GradeModel


class GradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = GradeModel
        fields = ('__all__')
