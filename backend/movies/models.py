from django.db import models
from actors.models import Actor


class Movie(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    release_date = models.DateField()
    poster_url = models.URLField()
    rating = models.FloatField(default=0.0)
    box_office_rank = models.IntegerField(null=True, blank=True)
    sales_amount = models.BigIntegerField(null=True, blank=True)
    sales_accumulate = models.BigIntegerField(null=True, blank=True)
    audience_cnt = models.BigIntegerField(null=True, blank=True)
    audience_accumulate = models.BigIntegerField(null=True, blank=True)
    genres = models.JSONField(null=True, blank=True)
    origin_country = models.CharField(max_length=255, null=True, blank=True)
    original_title = models.CharField(max_length=255, null=True, blank=True)
    popularity = models.FloatField(null=True, blank=True)
    production_countries = models.JSONField(null=True, blank=True)
    runtime = models.IntegerField(null=True, blank=True)
    vote_count = models.IntegerField(null=True, blank=True)
    credits = models.ManyToManyField(Actor, through='MovieActor')
    stills = models.JSONField(null=True, blank=True)
    trailers = models.JSONField(null=True, blank=True)
    review_videoes = models.JSONField(null=True, blank=True)
    
    def __str__(self):
        return self.title

class MovieActor(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    actor = models.ForeignKey(Actor, on_delete=models.CASCADE)
    character = models.CharField(max_length=255, null=True, blank=True)
    order = models.IntegerField(null=True, blank=True)