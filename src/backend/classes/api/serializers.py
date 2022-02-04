from rest_framework import serializers
from classes.models import ClassModel, CourseEnrollment, SubjectModel
from account.api.serializers import UserSerializer
from grades.api.serializers import GradeSerializer

class SubjectSerializer(serializers.ModelSerializer):
    grade = GradeSerializer(read_only=True)

    class Meta:
        model = SubjectModel
        fields = ('__all__')


class ClassSerializer(serializers.ModelSerializer):
    grade = GradeSerializer(read_only=True)

    class Meta:
        model = ClassModel
        fields = ('__all__')

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['subject'] = SubjectSerializer(instance.subject).data
        return rep

class CourseEnrollmentSerializer(serializers.ModelSerializer):
    # Bring in class details from ClassModel
    class_id = ClassSerializer(read_only=True)
    student_id = UserSerializer(read_only=True)

    class Meta:
        model = CourseEnrollment
        fields = ('__all__')


class CourseEnrollmentWithTaskSerializer(serializers.ModelSerializer):
    class_id = ClassSerializer(read_only=True)
    student_id = UserSerializer(read_only=True)

    class Meta:
        model = CourseEnrollment
        fields = ('__all__')
