from django.urls import path
from .views import MovieActorListView, MovieActorDetailView

urlpatterns = [
    path('', MovieActorListView.as_view(), name='movieactor-list'),
    path('<int:pk>/', MovieActorDetailView.as_view(), name='movieactor-detail'),
]
