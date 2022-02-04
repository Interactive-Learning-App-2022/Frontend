from django.test import TestCase
from ..models import ClassModel, CourseEnrollment
from django.contrib.auth.models import User
from datetime import datetime, time


class ClassTest(TestCase):
    """ Test module for Class model """

    def setUp(self):
        # Create two courses
        ClassModel.objects.create(
            grade=6, subject='MATH', teacher_id=1, starts_at=time(8, 30),
            ends_at=time(9, 30), school='Western', room='B-201'
        )

        ClassModel.objects.create(
            grade=3, subject='ENGLISH', teacher_id=1, starts_at=time(9, 30),
            ends_at=time(10, 30), school='KVCC', room='D-200'
        )

    # Tests to ensure information is stored properly in database
    def test_school_name(self):

        class_obj1 = ClassModel.objects.get(grade=6, subject='MATH')
        class_obj2 = ClassModel.objects.get(grade=3, subject='ENGLISH')

        self.assertEqual(class_obj1.school, 'Western')
        self.assertEqual(class_obj2.school, 'KVCC')

    def test_start_time(self):
        class_obj1 = ClassModel.objects.get(grade=6, subject='MATH')
        class_obj2 = ClassModel.objects.get(grade=3, subject='ENGLISH')

        self.assertEqual(class_obj1.starts_at, time(8, 30))
        self.assertEqual(class_obj2.starts_at, time(9, 30))

    def test_end_time(self):
        class_obj1 = ClassModel.objects.get(grade=6, subject='MATH')
        class_obj2 = ClassModel.objects.get(grade=3, subject='ENGLISH')

        self.assertEqual(class_obj1.ends_at, time(9, 30))
        self.assertEqual(class_obj2.ends_at, time(10, 30))


class CourseEnrollmentTest(TestCase):
    """ Test module for CourseEnrollment model """

    def setUp(self):
        # Create two classes
        class1 = ClassModel.objects.create(
            grade=6, subject='MATH', teacher_id=1, starts_at=time(8, 30),
            ends_at=time(9, 30), school='Western', room='B-201'
        )

        class2 = ClassModel.objects.create(
            grade=3, subject='ENGLISH', teacher_id=1, starts_at=time(9, 30),
            ends_at=time(10, 30), school='KVCC', room='D-200'
        )

        # Create user
        user = User.objects.create_user(username='john',
                                        email='test@email.com',
                                        password='test')

        # Enroll user in both classes
        CourseEnrollment.objects.create(student_id=user, class_id=class1)
        CourseEnrollment.objects.create(student_id=user, class_id=class2)

    def test_course_enrollment1(self):
        # Test if user is enrolled in both courses
        # by accessing students from class object
        class_obj1 = ClassModel.objects.get(grade=6, subject='MATH')
        class_obj2 = ClassModel.objects.get(grade=3, subject='ENGLISH')
        user = User.objects.get(username='john')

        self.assertEqual(user, class_obj1.students.get(
            student_id=user).student_id)
        self.assertEqual(user, class_obj2.students.get(
            student_id=user).student_id)

    def test_course_enrollment2(self):
        # Test if user is enrolled in both courses
        # by accessing courses from student object
        class_obj1 = ClassModel.objects.get(grade=6, subject='MATH')
        class_obj2 = ClassModel.objects.get(grade=3, subject='ENGLISH')
        user = User.objects.get(username='john')

        self.assertEqual(class_obj1, user.courses.get(
            class_id=class_obj1).class_id)
        self.assertEqual(class_obj2, user.courses.get(
            class_id=class_obj2).class_id)
