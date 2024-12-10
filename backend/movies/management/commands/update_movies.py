from django.core.management.base import BaseCommand
from movies.utils import save_tmdb_data, save_kobis_data, save_youtube_reviews_data

class Command(BaseCommand):
    help = 'Fetch and update movie data from Box Office and TMDB'

    def handle(self, *args, **kwargs):
        save_tmdb_data()
        save_kobis_data()
        save_youtube_reviews_data()
        self.stdout.write(self.style.SUCCESS('Successfully updated movie data from TMDB and KOBIS'))
