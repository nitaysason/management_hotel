# Generated by Django 5.0.6 on 2024-07-23 19:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='contactmessage',
            name='response',
            field=models.TextField(blank=True, null=True),
        ),
    ]