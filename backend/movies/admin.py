from django.contrib import admin
from .models import WatchlistItem



@admin.register(WatchlistItem)
class WatchlistItemAdmin(admin.ModelAdmin):
    list_display = ("user", "tmdb_id", "title", "added_at")
    search_fields = ("user__username", "title")
    list_filter = ("added_at",)

