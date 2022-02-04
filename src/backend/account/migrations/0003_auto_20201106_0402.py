# Generated by Django 3.1.3 on 2020-11-06 04:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0002_auto_20201018_2315'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='student',
            name='classes',
        ),
        migrations.RemoveField(
            model_name='student',
            name='user',
        ),
        migrations.AddField(
            model_name='student',
            name='first_name',
            field=models.CharField(default='student@example.com', max_length=50),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='student',
            name='last_name',
            field=models.CharField(default='Texas Ranger', max_length=50),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='student',
            name='username',
            field=models.CharField(default='student@example.com', max_length=50),
            preserve_default=False,
        ),
    ]
