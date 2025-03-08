from rest_framework import serializers
from .models import Club

class ClubSerializer(serializers.ModelSerializer):
    class Meta:
        model = Club
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at', 'created_by') 