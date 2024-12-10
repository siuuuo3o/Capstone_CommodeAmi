from django.urls import path
from . import views
from .views import MovieListView,MovieActorListView,MovieActorDetailView

urlpatterns = [
    path('', MovieListView.as_view(), name='movie-list'),
    path('<int:pk>/', views.MovieDetail.as_view(), name='movie-detail'),
    path('api/movieactors/', MovieActorListView.as_view(), name='movieactor-list'),
    path('api/movieactors/<int:pk>/', MovieActorDetailView.as_view(), name='movieactor-detail'),

]
