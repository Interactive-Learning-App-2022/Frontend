# Generated by Django 3.1.3 on 2021-10-13 22:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('proficiencies', '0022_auto_20211013_2158'),
    ]

    operations = [
        migrations.AddField(
            model_name='standardmodel',
            name='temp',
            field=models.CharField(default=1, max_length=2),
        ),
    ]
