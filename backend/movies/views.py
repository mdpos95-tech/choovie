import requests
import random
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes

from .models import WatchlistItem
from .serializers import WatchlistItemSerializer

@api_view(['GET'])
def health_check(request):
    return Response({"status": "ok"})

@api_view(['GET'])
def popular_movies(request):
    url = "http://api.themoviedb.org/3/movie/popular"

    params = {
        "api_key": settings.TMDB_API_KEY,
        "language": "en-US",
        "page": 1   

    }

    response = requests.get(url, params=params, timeout=10)

    return Response(response.json())

 

@api_view(["GET"])
def search_movies(request):
    query = request.GET.get("query", "").strip()

    if not query:
        return Response({"results": []})

    url = "https://api.themoviedb.org/3/search/movie"

    params = {
        "api_key": settings.TMDB_API_KEY,
        "language": "en-US",
        "query": query,
        "page": 1,
        "include_adult": "false",
    }

    response = requests.get(url, params=params, timeout=10)

    return Response({
        "results": response.json().get("results", [])
    })

@api_view(["GET"])
def recommend_movies(request):
    genre = request.GET.get("genre", "")
    mood = request.GET.get("mood", "")
    runtime = request.GET.get("runtime", "")
    release_period = request.GET.get("release_period", "")

    genre_ids = {
        "Action": 28,
        "Comedy": 35,
        "Drama": 18,
        "Horror": 27,
        "Romance": 10749,
        "Science Fiction": 878,
        "Thriller": 53,
    }

    mood_genres = {
    "Funny": [35],
    "Relaxing": [35, 10749, 10751, 16],
    "Exciting": [28, 12, 53],
    "Emotional": [18, 10749],
    "Dark": [27, 53, 80],
    "Thought-provoking": [18, 878, 9648],
}

    params = {
        "api_key": settings.TMDB_API_KEY,
        "language": "en-US",
        "sort_by": "popularity.desc",
        "include_adult": "false",
    }

    if genre in genre_ids:
        params["with_genres"] = genre_ids[genre]
    if genre not in genre_ids and mood in mood_genres:
        params["with_genres"] = "|".join(
            str(genre_id) for genre_id in mood_genres[mood]
        )

    if runtime == "Under 90 minutes":
        params["with_runtime.lte"] = 90
    elif runtime == "90 - 120 minutes":
        params["with_runtime.gte"] = 90
        params["with_runtime.lte"] = 120
    elif runtime == "Over 2 hours":
        params["with_runtime.gte"] = 120

    year_ranges = {
        "2020s": ("2020-01-01", "2029-12-31"),
        "2010s": ("2010-01-01", "2019-12-31"),
        "2000s": ("2000-01-01", "2009-12-31"),
        "1990s": ("1990-01-01", "1999-12-31"),
        "Before 1990": ("1900-01-01", "1989-12-31"),
    }

    if release_period in year_ranges:
        start_date, end_date = year_ranges[release_period]
        params["primary_release_date.gte"] = start_date
        params["primary_release_date.lte"] = end_date

    url = "https://api.themoviedb.org/3/discover/movie"

    results = []

    for page in range(1, 4):
        params["page"] = page

        response = requests.get(
            url,
            params=params,
            timeout=10,
        )

        results.extend(
            response.json().get("results", [])
        )

        unique_movies = {movie["id"]: movie for movie in results}
        results = list(unique_movies.values())

        if mood == "Surprise Me":
            random.shuffle(results)

        elif mood in mood_genres:
            preferred_genres = set(mood_genres[mood])

            mood_matches = [
                movie
                for movie in results
                if preferred_genres.intersection(movie.get("genre_ids", []))
            ]

            results = mood_matches

        return Response({
        "mood": mood,
        "results": results,
        })


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def watchlist(request):
    if request.method == "GET":
        items = WatchlistItem.objects.filter(user=request.user)
        serializer = WatchlistItemSerializer(items, many=True)
        return Response(serializer.data)

    serializer = WatchlistItemSerializer(data=request.data)

    if serializer.is_valid():
        tmdb_id = serializer.validated_data["tmdb_id"]

        if WatchlistItem.objects.filter(
            user=request.user,
            tmdb_id=tmdb_id,
        ).exists():
            return Response(
                {"detail": "Movie is already in your watchlist."},
                status=400,
            )

        serializer.save(user=request.user)
        return Response(serializer.data, status=201)

    return Response(serializer.errors, status=400)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def remove_watchlist_item(request, item_id):
    try:
        item = WatchlistItem.objects.get(
            id=item_id,
            user=request.user,
        )
    except WatchlistItem.DoesNotExist:
        return Response(
            {"detail": "Watchlist item not found."},
            status=404,
        )

    item.delete()

    return Response(
        {"detail": "Movie removed from watchlist."},
        status=200,
    )    