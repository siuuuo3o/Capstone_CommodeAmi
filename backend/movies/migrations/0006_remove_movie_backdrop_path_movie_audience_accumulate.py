# Generated by Django 5.0.6 on 2024-05-28 01:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('movies', '0005_remove_movie_audience_accumulate_movie_stills_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='movie',
            name='backdrop_path',
        ),
        migrations.AddField(
            model_name='movie',
            name='audience_accumulate',
            field=models.BigIntegerField(blank=True, null=True),
        ),
    ]
