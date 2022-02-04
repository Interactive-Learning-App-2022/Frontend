# Generated by Django 3.1.3 on 2020-12-06 20:49

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('classes', '0011_auto_20201206_0306'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('proficiencies', '0008_auto_20201206_1756'),
    ]

    operations = [
        migrations.AddField(
            model_name='proficiencylevel',
            name='class_id',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='Class_Info', to='classes.classmodel'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='proficiencylevel',
            name='proficiency_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='Proficiency_Info', to='proficiencies.proficiency'),
        ),
        migrations.AlterField(
            model_name='proficiencylevel',
            name='student_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='Student_Info', to=settings.AUTH_USER_MODEL),
        ),
    ]
