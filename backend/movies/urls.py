from django.urls import path
from .views import health_check, popular_movies, recommend_movies, watchlist

urlpatterns = [
    path('health/', health_check, name='health_check'),
    path('movies/popular/', popular_movies, name='popular_movies'),
    path('movies/recommend/', recommend_movies, name='recommend_movies'),
    path('watchlist/', watchlist, name='watchlist'),
]
