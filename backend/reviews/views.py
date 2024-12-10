from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import Review
from .serializers import ReviewSerializer

class ReviewListCreate(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        movie_id = self.kwargs['movie_id']
        return Review.objects.filter(movie_id=movie_id)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ReviewDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class UserReviewList(generics.ListAPIView):
    serializer_class = ReviewSerializer
    # ermission_classes = [permissions.AllowAny]
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Review.objects.filter(user=self.request.user)

class CombinedReviewList(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        movie_id = self.kwargs['movie_id']
        reviews = Review.objects.filter(movie_id=movie_id)
        combined_reviews = []

        for review in reviews:
            combined_reviews.append({
                'id': review.id,
                'movie': review.movie.id,
                'nickname': review.user.nickname if review.user.nickname else review.user.username,
                'text': review.text,
                'rating': review.rating,
                'date_watched': review.date_watched,
                'created_at': review.created_at,
            })
        
        return Response(combined_reviews)