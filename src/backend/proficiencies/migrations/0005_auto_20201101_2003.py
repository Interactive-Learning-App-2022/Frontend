# Generated by Django 3.1.2 on 2020-11-01 20:03

from django.db import migrations


class Migration(migrations.Migration):
    atomic = False
    dependencies = [
        ('proficiencies', '0004_auto_20201101_1959'),
    ]

    operations = [
        migrations.RenameField(
            model_name='proficiencylevel',
            old_name='prof_id',
            new_name='proficiency_id',
        ),
    ]
