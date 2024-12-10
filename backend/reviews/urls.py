from django.urls import path
from . import views

urlpatterns = [
    path('movies/<int:movie_id>/reviews/', views.ReviewListCreate.as_view(), name='review-list-create'),
    path('movies/<int:movie_id>/reviews/<int:pk>/', views.ReviewDetail.as_view(), name='review-detail'),
    path('user/reviews/', views.UserReviewList.as_view(), name='user-review-list'),  # 사용자 리뷰 목록
]