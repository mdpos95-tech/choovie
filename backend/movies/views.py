import requests
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response

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