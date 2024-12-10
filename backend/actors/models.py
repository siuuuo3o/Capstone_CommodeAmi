from django.db import models

class Actor(models.Model):
    name = models.CharField(max_length=255)
    gender = models.IntegerField(null=True, blank=True)
    known_for_department = models.CharField(max_length=255, null=True, blank=True)
    popularity = models.FloatField(null=True, blank=True)
    profile_path = models.URLField(null=True, blank=True)
    original_name = models.CharField(max_length=255, null=True, blank=True)
    
    def __str__(self):
        return self.name
