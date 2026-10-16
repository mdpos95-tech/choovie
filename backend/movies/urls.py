from django.urls import path
from .views import health_check, popular_movies

urlpatterns = [
    path('health/', health_check, name='health_check'),
    path('movies/popular/', popular_movies, name='popular_movies'),
]