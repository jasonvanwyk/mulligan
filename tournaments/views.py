from django.shortcuts import render, get_object_or_404
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Avg, Count, Sum
from django.http import HttpResponse
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from .models import Tournament, TournamentParticipant, TournamentResult, TournamentPoints, Participant, Point
from .serializers import (
    TournamentSerializer,
    TournamentParticipantSerializer,
    TournamentResultSerializer,
    TournamentPointsSerializer,
    TournamentStandingsSerializer,
    ParticipantSerializer,
    PointSerializer,
    TournamentDetailSerializer,
)

class TournamentListView(generics.ListAPIView):
    serializer_class = TournamentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Tournament.objects.filter(created_by=self.request.user)

class TournamentDetailView(generics.RetrieveAPIView):
    queryset = Tournament.objects.all()
    serializer_class = TournamentDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

class TournamentCreateView(generics.CreateAPIView):
    queryset = Tournament.objects.all()
    serializer_class = TournamentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class TournamentUpdateView(generics.UpdateAPIView):
    queryset = Tournament.objects.all()
    serializer_class = TournamentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_update(self, serializer):
        serializer.save()

class TournamentDeleteView(generics.DestroyAPIView):
    queryset = Tournament.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def perform_destroy(self, instance):
        instance.delete()

class TournamentParticipantListView(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = TournamentParticipantSerializer

    def get_queryset(self):
        return TournamentParticipant.objects.filter(tournament_id=self.kwargs['pk'])

class TournamentParticipantCreateView(generics.CreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = TournamentParticipantSerializer

    def perform_create(self, serializer):
        tournament = get_object_or_404(Tournament, pk=self.kwargs['pk'])
        serializer.save(tournament=tournament)

class TournamentParticipantDetailView(generics.RetrieveAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = TournamentParticipantSerializer

    def get_queryset(self):
        return TournamentParticipant.objects.filter(
            tournament_id=self.kwargs['pk'],
            pk=self.kwargs['participant_pk']
        )

class TournamentParticipantDeleteView(generics.DestroyAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = TournamentParticipantSerializer

    def get_queryset(self):
        return TournamentParticipant.objects.filter(
            tournament_id=self.kwargs['pk'],
            pk=self.kwargs['participant_pk']
        )

    def perform_destroy(self, instance):
        instance.delete()

class TournamentParticipantUpdateView(generics.UpdateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = TournamentParticipantSerializer

    def get_queryset(self):
        return TournamentParticipant.objects.filter(
            tournament_id=self.kwargs['pk'],
            pk=self.kwargs['participant_pk']
        )

    def perform_update(self, serializer):
        serializer.save()

class TournamentResultListView(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = TournamentResultSerializer

    def get_queryset(self):
        return TournamentResult.objects.filter(tournament_id=self.kwargs['pk'])

class TournamentResultCreateView(generics.CreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = TournamentResultSerializer

    def perform_create(self, serializer):
        tournament = get_object_or_404(Tournament, pk=self.kwargs['pk'])
        serializer.save(tournament=tournament, created_by=self.request.user)

class TournamentResultDetailView(generics.RetrieveAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = TournamentResultSerializer

    def get_queryset(self):
        return TournamentResult.objects.filter(
            tournament_id=self.kwargs['pk'],
            pk=self.kwargs['result_pk']
        )

class TournamentResultUpdateView(generics.UpdateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = TournamentResultSerializer

    def get_queryset(self):
        return TournamentResult.objects.filter(
            tournament_id=self.kwargs['pk'],
            pk=self.kwargs['result_pk']
        )

    def perform_update(self, serializer):
        serializer.save()

class TournamentResultDeleteView(generics.DestroyAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = TournamentResultSerializer

    def get_queryset(self):
        return TournamentResult.objects.filter(
            tournament_id=self.kwargs['pk'],
            pk=self.kwargs['result_pk']
        )

    def perform_destroy(self, instance):
        instance.delete()

class TournamentPointsListView(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = TournamentPointsSerializer

    def get_queryset(self):
        return TournamentPoints.objects.filter(tournament_id=self.kwargs['pk'])

class TournamentPointsCreateView(generics.CreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = TournamentPointsSerializer

    def perform_create(self, serializer):
        tournament = get_object_or_404(Tournament, pk=self.kwargs['pk'])
        serializer.save(tournament=tournament)

class TournamentPointsDetailView(generics.RetrieveAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = TournamentPointsSerializer

    def get_queryset(self):
        return TournamentPoints.objects.filter(
            tournament_id=self.kwargs['pk'],
            pk=self.kwargs['points_pk']
        )

class TournamentPointsUpdateView(generics.UpdateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = TournamentPointsSerializer

    def get_queryset(self):
        return TournamentPoints.objects.filter(
            tournament_id=self.kwargs['pk'],
            pk=self.kwargs['points_pk']
        )

    def perform_update(self, serializer):
        serializer.save()

class TournamentPointsDeleteView(generics.DestroyAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = TournamentPointsSerializer

    def get_queryset(self):
        return TournamentPoints.objects.filter(
            tournament_id=self.kwargs['pk'],
            pk=self.kwargs['points_pk']
        )

    def perform_destroy(self, instance):
        instance.delete()

class TournamentStandingsView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, pk):
        tournament = get_object_or_404(Tournament, pk=pk)
        participants = Participant.objects.filter(tournament=tournament)
        standings = []

        for participant in participants:
            results = TournamentResult.objects.filter(
                tournament=tournament,
                participant=participant
            )
            total_score = results.aggregate(total=Sum('score'))['total'] or 0
            rounds_played = results.count()
            average_score = results.aggregate(avg=Avg('score'))['avg'] or 0

            # Calculate position based on total score
            position = (TournamentResult.objects
                .filter(tournament=tournament)
                .values('participant')
                .annotate(total=Sum('score'))
                .filter(total__lt=total_score)
                .count() + 1)

            # Get points based on position
            points = (TournamentPoints.objects
                .filter(tournament=tournament, position=position)
                .first())
            points_value = points.points if points else 0

            standings.append({
                'participant': str(participant),
                'total_score': total_score,
                'rounds_played': rounds_played,
                'average_score': round(average_score, 1) if average_score else 0,
                'position': position,
                'points': points_value
            })

        # Sort standings by total score (ascending, since lower is better in golf)
        standings.sort(key=lambda x: x['total_score'])
        return Response(standings)

class TournamentStandingsPDFView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, pk):
        tournament = Tournament.objects.get(pk=pk)
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="{tournament.name}_standings.pdf"'
        
        p = canvas.Canvas(response, pagesize=letter)
        
        # Title
        p.setFont("Helvetica-Bold", 16)
        p.drawString(1*inch, 10*inch, f"{tournament.name} - Standings")
        
        # Headers
        p.setFont("Helvetica-Bold", 12)
        p.drawString(1*inch, 9*inch, "Position")
        p.drawString(2*inch, 9*inch, "Participant")
        p.drawString(5*inch, 9*inch, "Total Score")
        p.drawString(6.5*inch, 9*inch, "Rounds")
        p.drawString(7.5*inch, 9*inch, "Points")
        
        # Data
        p.setFont("Helvetica", 12)
        standings = TournamentStandingsView().get(request, pk).data
        
        y = 8.5*inch
        for standing in standings:
            p.drawString(1*inch, y, str(standing['position']))
            p.drawString(2*inch, y, standing['participant'])
            p.drawString(5*inch, y, str(standing['total_score']))
            p.drawString(6.5*inch, y, str(standing['rounds_played']))
            p.drawString(7.5*inch, y, str(standing['points']))
            y -= 0.5*inch
            
        p.showPage()
        p.save()
        
        return response

class ParticipantListView(generics.ListAPIView):
    serializer_class = ParticipantSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        tournament_id = self.kwargs.get('tournament_id')
        return Participant.objects.filter(tournament_id=tournament_id)

class ParticipantCreateView(generics.CreateAPIView):
    serializer_class = ParticipantSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        tournament_id = self.kwargs.get('tournament_id')
        tournament = get_object_or_404(Tournament, id=tournament_id)
        serializer.save(tournament=tournament)

class ParticipantDetailView(generics.RetrieveAPIView):
    serializer_class = ParticipantSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        tournament_id = self.kwargs.get('tournament_id')
        return Participant.objects.filter(tournament_id=tournament_id)

class ParticipantUpdateView(generics.UpdateAPIView):
    serializer_class = ParticipantSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        tournament_id = self.kwargs.get('tournament_id')
        return Participant.objects.filter(tournament_id=tournament_id)

    def perform_update(self, serializer):
        serializer.save()

class ParticipantDeleteView(generics.DestroyAPIView):
    serializer_class = ParticipantSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        tournament_id = self.kwargs.get('tournament_id')
        return Participant.objects.filter(tournament_id=tournament_id)

    def perform_destroy(self, instance):
        instance.delete()

class PointListView(generics.ListAPIView):
    serializer_class = PointSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        tournament_id = self.kwargs.get('tournament_id')
        return Point.objects.filter(tournament_id=tournament_id)

class PointCreateView(generics.CreateAPIView):
    serializer_class = PointSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        tournament_id = self.kwargs.get('tournament_id')
        tournament = get_object_or_404(Tournament, id=tournament_id)
        serializer.save(tournament=tournament)

class PointDetailView(generics.RetrieveAPIView):
    serializer_class = PointSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        tournament_id = self.kwargs.get('tournament_id')
        return Point.objects.filter(tournament_id=tournament_id)

class PointUpdateView(generics.UpdateAPIView):
    serializer_class = PointSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        tournament_id = self.kwargs.get('tournament_id')
        return Point.objects.filter(tournament_id=tournament_id)

    def perform_update(self, serializer):
        serializer.save()

class PointDeleteView(generics.DestroyAPIView):
    serializer_class = PointSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        tournament_id = self.kwargs.get('tournament_id')
        return Point.objects.filter(tournament_id=tournament_id)

    def perform_destroy(self, instance):
        instance.delete()
