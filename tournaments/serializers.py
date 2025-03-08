from rest_framework import serializers
from .models import (
    Tournament,
    Participant,
    Point,
    TournamentParticipant,
    TournamentResult,
    TournamentPoints,
)
from clubs.serializers import ClubSerializer
from golfers.serializers import GolferSerializer

class ParticipantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Participant
        fields = ['id', 'name', 'email', 'phone', 'handicap', 'is_club_participant', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

class PointSerializer(serializers.ModelSerializer):
    class Meta:
        model = Point
        fields = ['id', 'position', 'points', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

class TournamentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tournament
        fields = ['id', 'name', 'description', 'start_date', 'end_date', 'venue', 
                 'tournament_type', 'status', 'created_by', 'created_at', 'updated_at']
        read_only_fields = ['created_by', 'created_at', 'updated_at']

class TournamentDetailSerializer(serializers.ModelSerializer):
    participants = ParticipantSerializer(many=True, read_only=True)
    points = PointSerializer(many=True, read_only=True)

    class Meta:
        model = Tournament
        fields = ['id', 'name', 'description', 'start_date', 'end_date', 'venue', 
                 'tournament_type', 'status', 'created_by', 'created_at', 'updated_at',
                 'participants', 'points']
        read_only_fields = ['created_by', 'created_at', 'updated_at']

class TournamentParticipantSerializer(serializers.ModelSerializer):
    participant_data = ParticipantSerializer(write_only=True)
    participant = ParticipantSerializer(read_only=True)

    class Meta:
        model = TournamentParticipant
        fields = ['id', 'tournament', 'participant', 'participant_data', 'is_club_participant', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def create(self, validated_data):
        participant_data = validated_data.pop('participant_data')
        participant = Participant.objects.create(tournament=validated_data['tournament'], **participant_data)
        tournament_participant = TournamentParticipant.objects.create(participant=participant, **validated_data)
        return tournament_participant

class TournamentResultSerializer(serializers.ModelSerializer):
    participant = ParticipantSerializer(read_only=True)
    participant_id = serializers.PrimaryKeyRelatedField(
        source='participant',
        queryset=Participant.objects.all(),
        write_only=True
    )

    class Meta:
        model = TournamentResult
        fields = ['id', 'tournament', 'participant', 'participant_id', 'round_number', 'score', 
                 'date_played', 'created_by', 'created_at', 'updated_at']
        read_only_fields = ['created_by', 'created_at', 'updated_at']

    def validate(self, data):
        if data['participant'].tournament != data['tournament']:
            raise serializers.ValidationError("Participant must belong to the tournament")
        return data

class TournamentPointsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TournamentPoints
        fields = ['id', 'tournament', 'position', 'points', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

class TournamentStandingsSerializer(serializers.Serializer):
    participant = serializers.CharField()
    total_score = serializers.IntegerField()
    rounds_played = serializers.IntegerField()
    average_score = serializers.FloatField()
    position = serializers.IntegerField()
    points = serializers.IntegerField() 