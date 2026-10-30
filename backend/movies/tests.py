from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from .models import WatchlistItem
from unittest.mock import Mock, patch


class WatchlistTests(APITestCase):

    def test_watchlist_requires_login(self):
        response = self.client.get("/api/watchlist/")

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

    def test_logged_in_user_can_add_movie_to_watchlist(self):
        user = User.objects.create_user(
            username="testuser",
            password="testpassword123",
        )

        self.client.force_authenticate(user=user)

        response = self.client.post(
            "/api/watchlist/",
            {
                "tmdb_id": 12345,
                "title": "Test Movie",
                "poster_path": "/test.jpg",
            },
            format="json",
        )
        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )
        self.assertEqual(response.data["title"], "Test Movie")

    def test_logged_in_user_can_remove_movie_from_watchlist(self):
        user = User.objects.create_user(
            username="testuser",
            password="testpassword123",
        )

        item = WatchlistItem.objects.create(
            user=user,
            tmdb_id=12345,
            title="Test Movie",
            poster_path="/test.jpg",
        )

        self.client.force_authenticate(user=user)

        response = self.client.delete(
            f"/api/watchlist/{item.id}/"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.assertFalse(
            WatchlistItem.objects.filter(id=item.id).exists()
        )

    def test_logged_in_user_cannot_remove_another_users_watchlist_item(self):
        owner = User.objects.create_user(
            username="owner",
            password="testpassword123",
        )

        other_user = User.objects.create_user(
            username="otheruser",
            password="testpassword123",
        )

        item = WatchlistItem.objects.create(
            user=owner,
            tmdb_id=12345,
            title="Test Movie",
            poster_path="/test.jpg",
        )

        self.client.force_authenticate(user=other_user)
        response = self.client.delete(
            f"/api/watchlist/{item.id}/"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND,
        )

        self.assertTrue(
            WatchlistItem.objects.filter(id=item.id).exists()
        )


class RecommendationTests(APITestCase):

    @patch("movies.views.rank_movies")
    @patch("movies.views.requests.get")
    def test_choose_for_me_returns_three_ai_picks(
        self,
        mock_get,
        mock_rank_movies,
    ):
        tmdb_movies = [
            {
                "id": 1,
                "title": "Comedy One",
                "genre_ids": [35],
                "overview": "Funny movie",
                "vote_average": 7.5,
                "release_date": "2025-01-01",
            },
            {
                "id": 2,
                "title": "Comedy Two",
                "genre_ids": [35],
                "overview": "Another funny movie",
                "vote_average": 8.0,
                "release_date": "2024-01-01",
            },
            {
                "id": 3,
                "title": "Comedy Three",
                "genre_ids": [35],
                "overview": "A third funny movie",
                "vote_average": 7.8,
                "release_date": "2023-01-01",
            },
        ]

        mock_response = Mock()
        mock_response.json.return_value = {
            "results": tmdb_movies,
        }

        mock_get.return_value = mock_response
        mock_rank_movies.return_value = tmdb_movies

        response = self.client.get(
            "/api/movies/recommend/",
            {
                "genre": "Comedy",
                "mood": "Funny",
                "runtime": "",
                "release_period": "",
                "mode": "Choose For Me",
            },
        )