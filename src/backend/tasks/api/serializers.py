from rest_framework import serializers
from classes.api.serializers import ClassSerializer
from account.api.serializers import UserSerializer
from tasks.models import TasksModel, ScoreInfomation, TasksAssignedModel, AssessmentModel, AssessmentAssignedModel, VideoModuleModel
from scores.api.serializers import ScoreSerializer


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = TasksModel
        fields = ('__all__')


class ScoreInfomationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScoreInfomation
        fields = ('__all__')


class TasksAssignedSerializer(serializers.ModelSerializer):
    class_id = ClassSerializer(read_only=True)
    assigned_student = UserSerializer(read_only=True)
    task_id = TaskSerializer(read_only=True)
    scores_id = ScoreSerializer(read_only=True)

    class Meta:
        model = TasksAssignedModel
        fields = ('__all__')


class TasksAssignedCreator(serializers.ModelSerializer):
    class Meta:
        model = TasksAssignedModel
        fields = ('__all__')

    def create(self, validated_data):
        newtask = TasksAssignedModel.objects.create(
            class_id=validated_data['class_id'],
            task_id=validated_data['task_id'],
            assigned_student=validated_data['assigned_student'],
            status=validated_data['status'],
            scores_id=validated_data['scores_id'],
            due_date=validated_data['due_date']
        )
        return newtask

class AssessmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssessmentModel
        fields = ('__all__')

class AssessmentsAssignedCreator(serializers.ModelSerializer):
    class Meta:
        model = AssessmentAssignedModel
        fields = ('__all__')

    def create(self, validated_data):
        newtask = AssessmentAssignedModel.objects.create(
            class_id=validated_data['class_id'],
            assessment_id=validated_data['assessment_id'],
            assigned_student=validated_data['assigned_student'],
            proficiency_id =validated_data['proficiency_id'],
            status=validated_data['status']
        )
        return newtask

class AssessmentsAssignedSerializer(serializers.ModelSerializer):
    class_id = ClassSerializer(read_only=True)
    assigned_student = UserSerializer(read_only=True)
    assessment_id = AssessmentSerializer(read_only=True)

    class Meta:
        model = AssessmentAssignedModel
        fields = ('__all__')

class VideoModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = VideoModuleModel
        fields = ('__all__')