import requests
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

    params = {
        "api_key": settings.TMDB_API_KEY,
        "language": "en-US",
        "sort_by": "popularity.desc",
        "include_adult": "false",
    }

    if genre in genre_ids:
        params["with_genres"] = genre_ids[genre]

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
    response = requests.get(url, params=params, timeout=10)

    return Response({
        "mood": mood,
        "results": response.json().get("results", []),
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