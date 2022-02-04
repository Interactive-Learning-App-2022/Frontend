from rest_framework import serializers
from proficiencies.models import Proficiency, ProficiencyLevel, StandardModel, StandardLevel
from grades.api.serializers import GradeSerializer
from account.api.serializers import UserSerializer
from classes.api.serializers import ClassSerializer, SubjectSerializer
from scores.api.serializers import ScoreSerializer


class ProficiencySerializer(serializers.ModelSerializer):
    grade = GradeSerializer(read_only=True)

    class Meta:
        model = Proficiency
        fields = ('__all__')

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['standard_info'] = StandardSerializer(instance.standard).data
        return rep

class ProficiencyLevelSerializer(serializers.ModelSerializer):
    # Tie back to master proficiency model
    proficiency_id = ProficiencySerializer(read_only=True)
    class_id = ClassSerializer(read_only=True)
    student_id = UserSerializer(read_only=True)
    scores_id = ScoreSerializer(read_only=True)
    subject = SubjectSerializer(read_only=True)

    class Meta:
        model = ProficiencyLevel
        fields = ('__all__')


class StandardSerializer(serializers.ModelSerializer):
    grade = GradeSerializer(read_only=True)

    class Meta:
        model = StandardModel
        fields = ('__all__')


class StandardLevelSerializer(serializers.ModelSerializer):
    # Tie back to master standard model
    Standard_id = StandardSerializer(read_only=True)
    class_id = ClassSerializer(read_only=True)
    student_id = UserSerializer(read_only=True)
    proficiency_id = ProficiencySerializer(read_only=True)

    class Meta:
        model = StandardLevel
        fields = ('__all__')

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['standard'] = StandardSerializer(instance.standard_id).data
        return rep