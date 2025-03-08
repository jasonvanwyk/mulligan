from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator
from django.utils import timezone

class Tournament(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    start_date = models.DateField()
    end_date = models.DateField()
    venue = models.CharField(max_length=200)
    tournament_type = models.CharField(max_length=20, choices=[
        ('individual', 'Individual'),
        ('inter_club', 'Inter-Club'),
        ('both', 'Both')
    ])
    status = models.CharField(max_length=20, choices=[
        ('draft', 'Draft'),
        ('active', 'Active'),
        ('completed', 'Completed')
    ], default='draft')
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['-start_date']

class Participant(models.Model):
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='participants')
    name = models.CharField(max_length=200)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    handicap = models.DecimalField(max_digits=3, decimal_places=1, null=True, blank=True)
    is_club_participant = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.tournament.name}"

    class Meta:
        unique_together = ['tournament', 'name']

class Point(models.Model):
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='points')
    position = models.IntegerField(validators=[MinValueValidator(1)])
    points = models.IntegerField(validators=[MinValueValidator(0)])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.tournament.name} - Position {self.position}: {self.points} points"

    class Meta:
        unique_together = ['tournament', 'position']
        ordering = ['position']

class TournamentParticipant(models.Model):
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='tournament_participants')
    participant = models.ForeignKey(Participant, on_delete=models.CASCADE)
    is_club_participant = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.participant.name} - {self.tournament.name}"

    class Meta:
        unique_together = ['tournament', 'participant']

class TournamentResult(models.Model):
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='results')
    participant = models.ForeignKey(Participant, on_delete=models.CASCADE)
    round_number = models.IntegerField(validators=[MinValueValidator(1)])
    score = models.IntegerField(validators=[MinValueValidator(1)])
    date_played = models.DateField()
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.participant.name} - Round {self.round_number}: {self.score}"

    class Meta:
        unique_together = ['tournament', 'participant', 'round_number']
        ordering = ['-date_played', 'round_number']

class TournamentPoints(models.Model):
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='tournament_points')
    position = models.IntegerField(validators=[MinValueValidator(1)])
    points = models.IntegerField(validators=[MinValueValidator(0)])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.tournament.name} - Position {self.position}: {self.points} points"

    class Meta:
        unique_together = ['tournament', 'position']
        ordering = ['position']
