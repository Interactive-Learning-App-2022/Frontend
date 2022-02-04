from rest_framework import serializers
from scores.models import ScoreInfomation


class ScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScoreInfomation
        fields = ('__all__')
