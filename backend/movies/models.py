from django.db import models
from django.contrib.auth.models import User




class WatchlistItem(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="watchlist_items",
    )
    tmdb_id = models.IntegerField()
    title = models.CharField(max_length=255)
    poster_path = models.CharField(max_length=255, blank=True)
    release_date = models.CharField(max_length=20, blank=True)
    overview = models.TextField(blank=True)
    vote_average = models.FloatField(null=True, blank=True)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "tmdb_id"],
                name="unique_user_watchlist_movie",
            )
        ]

    def __str__(self):
        return f"{self.user.username} - {self.title}"


class RecommendationLog(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    mode = models.CharField(max_length=50)
    genre = models.CharField(max_length=100, blank=True)
    mood = models.CharField(max_length=100, blank=True)
    runtime = models.CharField(max_length=100, blank=True)
    release_period = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.mode} - {self.genre or 'Any Genre'} - {self.mood or 'Any Mood'}"