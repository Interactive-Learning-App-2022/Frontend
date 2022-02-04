# Generated by Django 3.1.3 on 2021-10-13 21:43

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('classes', '0012_auto_20211013_2143'),
        ('proficiencies', '0017_standardlevel_standard_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='standardmodel',
            name='subject',
            field=models.ForeignKey(default='Math', on_delete=django.db.models.deletion.CASCADE, related_name='subjects', to='classes.subjectmodel'),
        ),
    ]
