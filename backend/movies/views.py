from rest_framework import generics
from .models import Movie, MovieActor
from .serializers import MovieSerializer, MovieActorSerializer
from django.db.models import Q
from rest_framework.permissions import IsAuthenticatedOrReadOnly

class MovieListView(generics.ListAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer

    def get_queryset(self):
        queryset = Movie.objects.all()
        search_query = self.request.query_params.get('search', None)
        if search_query:
            search_query = search_query.strip()   #추가
            queryset = queryset.filter(Q(title__icontains=search_query))
        return queryset

class MovieDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class MovieActorListView(generics.ListCreateAPIView):
    queryset = MovieActor.objects.all()
    serializer_class = MovieActorSerializer

class MovieActorDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = MovieActor.objects.all()
    serializer_class = MovieActorSerializer
