# Generated by Django 3.1.3 on 2020-12-07 02:07

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('proficiencies', '0009_auto_20201206_2049'),
        ('tasks', '0008_auto_20201204_0018'),
    ]

    operations = [
        migrations.AddField(
            model_name='tasksmodel',
            name='proficiency_id',
            field=models.ForeignKey(default='MATH-5.NF.1', on_delete=django.db.models.deletion.CASCADE,
                                    related_name='Proficiency_id', to='proficiencies.proficiency'),
            preserve_default=False,
        ),
    ]
