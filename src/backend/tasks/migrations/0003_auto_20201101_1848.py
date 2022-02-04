# Generated by Django 3.1.2 on 2020-11-01 18:48

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0002_tasksassignedmodel'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='tasksmodel',
            name='scoreinfo',
        ),
        migrations.RemoveField(
            model_name='tasksmodel',
            name='status',
        ),
        migrations.AddField(
            model_name='tasksassignedmodel',
            name='scoreinfo',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='scores', to='tasks.scoreinfomation'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='tasksassignedmodel',
            name='status',
            field=models.CharField(choices=[('0', 'Have not started'), ('1', 'In progress'), ('2', 'Done')], default=1, max_length=1),
            preserve_default=False,
        ),
    ]
