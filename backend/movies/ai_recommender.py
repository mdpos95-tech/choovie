import json

from django.conf import settings
from openai import OpenAI

client = OpenAI(api_key=settings.OPENAI_API_KEY)

def rank_movies(movies, genre="", mood="", runtime="", release_period="", limit=3):
    if not movies:
        return []

    movie_data = [
        {
            "id": movie.get("id"),
            "title": movie.get("title"),
            "overview": movie.get("overview", ""),
            "rating": movie.get("vote_average"),
            "release_date": movie.get("release_date", ""),
        }
        for movie in movies
    ]

    prompt = f"""
You are helping a movie recommendation app called Choovie.

User preferences:
Genre: {genre or "Any"}
Mood: {mood or "Any"}
Runtime: {runtime or "Any"}
Release period: {release_period or "Any"}

Choose the best {limit} movies from the supplied TMDB candidates.

Only choose movies from the supplied list.
Do not invent titles or movie IDs.

Return JSON only in this format:
{{"movie_ids": [123, 456, 789]}}

Candidates:
{json.dumps(movie_data)}
"""

    response = client.responses.create(
        model="gpt-6-luna",
        input=prompt,
    )

    try:
        data = json.loads(response.output_text)
        ranked_ids = data.get("movie_ids", [])
    except (json.JSONDecodeError, AttributeError):
        return movies[:limit]

    movie_lookup = {
        movie.get("id"): movie
        for movie in movies
    }

    ranked_movies = [
        movie_lookup[movie_id]
        for movie_id in ranked_ids
        if movie_id in movie_lookup
    ]

    return ranked_movies[:limit] or movies[:limit]