from rest_framework import serializers
from .models import Review

class ReviewSerializer(serializers.ModelSerializer):
    nickname = serializers.CharField(source='user_nickname', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'movie', 'nickname', 'text', 'rating', 'date_watched', 'created_at']
