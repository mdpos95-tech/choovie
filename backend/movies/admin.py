from django.contrib import admin
from .models import WatchlistItem, RecommendationLog



@admin.register(WatchlistItem)
class WatchlistItemAdmin(admin.ModelAdmin):
    list_display = ("user", "tmdb_id", "title", "added_at")
    search_fields = ("user__username", "title")
    list_filter = ("added_at",)

@admin.register(RecommendationLog)
class RecommendationLogAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "mode",
        "genre",
        "mood",
        "runtime",
        "release_period",
        "created_at",
    )
    search_fields = (
        "user__username",
        "mode",
        "genre",
        "mood",
    )
    list_filter = (
        "mode",
        "genre",
        "mood",
        "created_at",
    )