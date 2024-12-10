from django.db import models
from movies.models import Movie
from django.conf import settings

# 필요에 따라 사용자별 추천을 기록할 수 있는 예시 모델입니다.
class Recommendation(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
