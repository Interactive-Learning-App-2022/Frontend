from django.test import TestCase
from ..models import Proficiency, ProficiencyLevel
from ...grades.models import GradeModel
from django.contrib.auth.models import User
from datetime import datetime, time


class ClassTest(TestCase):
    # Test module for Proficiency model

    def setUp(self):
        # Create proficiencies
        Proficiency.objects.create(
            name='MATH-5.NF.1', grade=5, subject='MATH', description='Add and subtract fractions.',
            long_description='Should be able to add and subtract fractions.'
        )

        Proficiency.objects.create(
            name='MATH-5.OA.1', grade=5, subject='MATH', description='Write and interpret numerical expressions.',
            long_description='Use parentheses, brackets, or braces in numerical expressions, and evaluate expressions with these symbols.'
        )

    # Tests to ensure information is stored properly in database
    def test_prof_name(self):

        prof1 = Proficiency.objects.get(proficiency_name='MATH-5.NF.1')
        prof2 = Proficiency.objects.get(proficiency_name='MATH-5.OA.1')

        self.assertEqual(prof1.description, 'Add and subtract fractions.')
        self.assertEqual(prof2.description,
                         'Write and interpret numerical expressions.')


class ProficiencyLevelTest(TestCase):
    # Test module for ProficiencyLevel model

    def setUp(self):
        # Create a class
        class_obj = ClassModel.objects.create(
            grade=6, subject='MATH', teacher_id=1, starts_at=time(8, 30),
            ends_at=time(9, 30), school='Western', room='B-201'
        )

        # Create 3 users
        student1 = User.objects.create_user(username='john',
                                            email='test1@email.com',
                                            password='test')

        student2 = User.objects.create_user(username='sarah',
                                            email='test2@email.com',
                                            password='test')

        student3 = User.objects.create_user(username='mike',
                                            email='test3@email.com',
                                            password='test')

        # Create proficiency
        prof = Proficiency.objects.create(
            name='MATH-5.NF.1', grade=5, subject='MATH', description='Add and subtract fractions.',
            long_description='Should be able to add and subtract fractions.'
        )

        # Create 3 proficiency levels
        ProficiencyLevel.objects.create(
            student_id=student1, class_id=class_obj, proficiency_id=prof, is_proficient='0')

        ProficiencyLevel.objects.create(
            student_id=student2, class_id=class_obj, proficiency_id=prof, is_proficient='1')

        ProficiencyLevel.objects.create(
            student_id=student3, class_id=class_obj, proficiency_id=prof, is_proficient='2')

    def test_proficiency_level(self):
        student1 = User.objects.get(username='john')
        student2 = User.objects.get(username='sarah')
        student3 = User.objects.get(username='mike')

        prof_level1 = ProficiencyLevel.objects.get(student_id=student1)
        prof_level2 = ProficiencyLevel.objects.get(student_id=student2)
        prof_level3 = ProficiencyLevel.objects.get(student_id=student3)

        self.assertEqual(prof_level1.is_proficient, '0')
        self.assertEqual(prof_level2.is_proficient, '1')
        self.assertEqual(prof_level3.is_proficient, '2')
