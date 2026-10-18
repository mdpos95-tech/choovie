from rest.framework import serializers
from .models import WatchlistItem


class WatchlistItemSerializer(serializers.ModelSerializer):
        class Meta:
            model = WatchlistItem
            fields = ("id", "tmdb_id", "title", "poster_path", "added_at")
            read_only_fields = ("id", "added_at")