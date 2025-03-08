from rest_framework import serializers
from .models import Golfer
from clubs.serializers import ClubSerializer

class GolferSerializer(serializers.ModelSerializer):
    club = ClubSerializer(read_only=True)
    club_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Golfer
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at', 'created_by')

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}" 