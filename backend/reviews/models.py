from django.db import models
from django.conf import settings
from movies.models import Movie

class Review(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    # text = models.TextField()
    text = models.TextField(null=True, blank=True)  # null 허용 추가
    rating = models.DecimalField(max_digits=3, decimal_places=1) 
    date_watched = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.text[:20]

    @property
    def user_nickname(self):
        return self.user.nickname if self.user.nickname else self.user.username
