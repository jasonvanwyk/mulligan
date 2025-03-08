from django.contrib import admin
from .models import Golfer

@admin.register(Golfer)
class GolferAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'club', 'handicap', 'created_by', 'created_at')
    list_filter = ('club', 'created_at')
    search_fields = ('first_name', 'last_name')
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('last_name', 'first_name')
