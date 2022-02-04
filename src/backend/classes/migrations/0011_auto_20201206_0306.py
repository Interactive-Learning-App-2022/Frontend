# Generated by Django 3.1.3 on 2020-12-06 03:06

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('grades', '0001_initial'),
        ('classes', '0010_auto_20201206_0305'),
    ]

    operations = [
        migrations.AlterField(
            model_name='classmodel',
            name='grade',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='grade', to='grades.grademodel'),
        ),
    ]
