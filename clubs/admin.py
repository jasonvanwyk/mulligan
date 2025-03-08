from django.contrib import admin
from .models import Club

@admin.register(Club)
class ClubAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_by', 'created_at', 'updated_at')
    search_fields = ('name',)
    list_filter = ('created_at', 'updated_at')
    readonly_fields = ('created_at', 'updated_at')
