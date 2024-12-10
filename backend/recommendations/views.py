from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import requests
import random
from django.conf import settings
from movies.models import Movie
from movies.serializers import MovieSerializer
import json

class RecommendMovieView(APIView):
    def get_weather_condition(self):
        """Fetches the current weather condition using OpenWeatherMap API."""
        api_key = settings.OPENWEATHERMAP_API_KEY
        url = f'http://api.openweathermap.org/data/2.5/weather?q=Seoul&appid={api_key}&units=metric'
        try:
            response = requests.get(url)
            response.raise_for_status()  # Raise an error for bad status codes
            weather_data = response.json()
            # Check if 'weather' data is present and valid
            if 'weather' in weather_data and len(weather_data['weather']) > 0:
                return weather_data['weather'][0]['main'].lower()
            else:
                print("Weather data is missing or invalid:", weather_data)  # Debugging output
                return None
        except (requests.RequestException, KeyError, IndexError) as e:
            print(f"Error fetching weather data: {e}")  # Log the error for debugging
            return None

    def filter_movies_by_genre(self, genre_pool, exclude_rainy=False):
        """Filters movies based on the provided genre pool."""
        all_movies = Movie.objects.all()
        filtered_movies = []

        for movie in all_movies:
            if movie.genres:
                try:
                    genres_data = json.loads(movie.genres) if isinstance(movie.genres, str) else movie.genres
                    if isinstance(genres_data, list):
                        if exclude_rainy:
                            # Exclude movies containing rainy_genres
                            if not any(isinstance(genre, dict) and genre.get('id') in genre_pool for genre in genres_data):
                                filtered_movies.append(movie)
                        else:
                            # Include movies containing genre_pool
                            if any(isinstance(genre, dict) and genre.get('id') in genre_pool for genre in genres_data):
                                filtered_movies.append(movie)
                except (ValueError, TypeError):
                    print(f"Error parsing genres for movie {movie.title}")  # Debugging output
                    continue
        return filtered_movies

    def get(self, request):
        weather_condition = self.get_weather_condition()

        if not weather_condition:
            return Response({"error": "Failed to fetch weather data"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Define genre pools
        rainy_genres = [53, 27, 80]  # Thriller, Horror, Crime
        clear_genres = [28, 12, 16, 35, 18, 10751, 14, 36, 10402, 10749, 878, 10770, 99, 37, 10752]  # Other genres
        cloudy_genres = [18, 99, 9648]  # Drama, Documentary, Mystery (example genres for cloudy weather)

        # Select and filter movies based on weather condition
        if weather_condition == 'rain':
            filtered_movies = self.filter_movies_by_genre(rainy_genres)
        elif weather_condition == 'clouds':
            filtered_movies = self.filter_movies_by_genre(cloudy_genres)
        else:  # Default to clear weather genres
            filtered_movies = self.filter_movies_by_genre(rainy_genres, exclude_rainy=True)

        if filtered_movies:
            # Select up to 10 movies randomly
            selected_movies = random.sample(filtered_movies, min(len(filtered_movies), 10))
            serializer = MovieSerializer(selected_movies, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"message": "No movies found for the current weather condition"}, status=status.HTTP_404_NOT_FOUND)
