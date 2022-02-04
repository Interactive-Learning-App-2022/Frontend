# Generated by Django 3.1.2 on 2020-10-12 04:47

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='ClassModel',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('grade', models.IntegerField()),
                ('subject', models.CharField(max_length=50)),
                ('teacher_id', models.IntegerField()),
                ('starts_at', models.TimeField()),
                ('ends_at', models.TimeField()),
                ('school', models.CharField(max_length=255)),
                ('room', models.CharField(max_length=255)),
            ],
        ),
    ]
