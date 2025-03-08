from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status
from datetime import date, timedelta
from .models import Tournament, Participant, TournamentParticipant, TournamentResult, TournamentPoints

class TournamentTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        # Clean up any existing data
        Tournament.objects.all().delete()
        Participant.objects.all().delete()
        TournamentParticipant.objects.all().delete()
        TournamentResult.objects.all().delete()
        TournamentPoints.objects.all().delete()

    def setUp(self):
        # Create a test user
        self.user = get_user_model().objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)
        
        # Create a test tournament
        self.tournament = Tournament.objects.create(
            name='Test Tournament',
            description='Test Description',
            start_date=date.today(),
            end_date=date.today() + timedelta(days=7),
            venue='Test Venue',
            tournament_type='individual',
            status='active',
            created_by=self.user
        )

    def test_create_tournament(self):
        """Test creating a new tournament"""
        url = reverse('tournament-create')
        data = {
            'name': 'New Tournament',
            'description': 'New Description',
            'start_date': date.today().isoformat(),
            'end_date': (date.today() + timedelta(days=7)).isoformat(),
            'venue': 'New Venue',
            'tournament_type': 'individual',
            'status': 'draft'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Tournament.objects.count(), 2)
        self.assertEqual(Tournament.objects.get(name='New Tournament').created_by, self.user)

    def test_tournament_list(self):
        """Test retrieving tournament list"""
        url = reverse('tournament-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Check pagination data
        self.assertEqual(response.data['count'], 1)
        self.assertIsNone(response.data['next'])
        self.assertIsNone(response.data['previous'])
        
        # Check results
        results = response.data['results']
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['name'], 'Test Tournament')

    def test_tournament_detail(self):
        """Test retrieving tournament detail"""
        url = reverse('tournament-detail', args=[self.tournament.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Test Tournament')

    def test_update_tournament(self):
        """Test updating a tournament"""
        url = reverse('tournament-update', args=[self.tournament.id])
        data = {
            'name': 'Updated Tournament',
            'description': self.tournament.description,
            'start_date': self.tournament.start_date.isoformat(),
            'end_date': self.tournament.end_date.isoformat(),
            'venue': self.tournament.venue,
            'tournament_type': self.tournament.tournament_type,
            'status': self.tournament.status
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.tournament.refresh_from_db()
        self.assertEqual(self.tournament.name, 'Updated Tournament')

class TournamentParticipantTests(APITestCase):
    def setUp(self):
        # Create test user and tournament
        self.user = get_user_model().objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)
        
        self.tournament = Tournament.objects.create(
            name='Test Tournament',
            start_date=date.today(),
            end_date=date.today() + timedelta(days=7),
            venue='Test Venue',
            tournament_type='individual',
            status='active',
            created_by=self.user
        )
        
        # Create test participant
        self.participant = Participant.objects.create(
            tournament=self.tournament,
            name='Test Participant',
            email='participant@example.com',
            handicap=10.0
        )

    def test_add_participant(self):
        """Test adding a participant to tournament"""
        url = reverse('tournament-participant-create', args=[self.tournament.id])
        data = {
            'tournament': self.tournament.id,
            'participant_data': {
                'name': 'New Participant',
                'email': 'new@example.com',
                'handicap': 15.0,
                'is_club_participant': True
            },
            'is_club_participant': True
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Participant.objects.count(), 2)

    def test_participant_list(self):
        """Test retrieving participant list"""
        url = reverse('tournament-participant-list', args=[self.tournament.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

class TournamentResultTests(APITestCase):
    def setUp(self):
        # Create test user, tournament, and participant
        self.user = get_user_model().objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)
        
        self.tournament = Tournament.objects.create(
            name='Test Tournament',
            start_date=date.today(),
            end_date=date.today() + timedelta(days=7),
            venue='Test Venue',
            tournament_type='individual',
            status='active',
            created_by=self.user
        )
        
        self.participant = Participant.objects.create(
            tournament=self.tournament,
            name='Test Participant',
            email='participant@example.com',
            handicap=10.0
        )

    def test_add_result(self):
        """Test adding a result for a participant"""
        url = reverse('tournament-result-create', args=[self.tournament.id])
        data = {
            'tournament': self.tournament.id,
            'participant_id': self.participant.id,
            'round_number': 1,
            'score': 72,
            'date_played': date.today().isoformat()
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(TournamentResult.objects.count(), 1)

    def test_invalid_result(self):
        """Test adding an invalid result"""
        url = reverse('tournament-result-create', args=[self.tournament.id])
        data = {
            'tournament': self.tournament.id,
            'participant_id': self.participant.id,
            'round_number': 1,
            'score': -1,  # Invalid score
            'date_played': date.today().isoformat()
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class TournamentStandingsTests(APITestCase):
    def setUp(self):
        # Create test user, tournament, participants, and results
        self.user = get_user_model().objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)
        
        self.tournament = Tournament.objects.create(
            name='Test Tournament',
            start_date=date.today(),
            end_date=date.today() + timedelta(days=7),
            venue='Test Venue',
            tournament_type='both',
            status='active',
            created_by=self.user
        )
        
        # Create participants and results
        self.participant1 = Participant.objects.create(
            tournament=self.tournament,
            name='Player 1',
            is_club_participant=True
        )
        
        self.participant2 = Participant.objects.create(
            tournament=self.tournament,
            name='Player 2',
            is_club_participant=True
        )
        
        # Add results
        TournamentResult.objects.create(
            tournament=self.tournament,
            participant=self.participant1,
            round_number=1,
            score=72,
            date_played=date.today(),
            created_by=self.user
        )
        
        TournamentResult.objects.create(
            tournament=self.tournament,
            participant=self.participant2,
            round_number=1,
            score=75,
            date_played=date.today(),
            created_by=self.user
        )
        
        # Add points structure
        TournamentPoints.objects.create(
            tournament=self.tournament,
            position=1,
            points=100
        )
        TournamentPoints.objects.create(
            tournament=self.tournament,
            position=2,
            points=80
        )

    def test_standings_calculation(self):
        """Test tournament standings calculation"""
        url = reverse('tournament-standings', args=[self.tournament.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verify standings order
        standings = response.data
        self.assertEqual(len(standings), 2)
        self.assertEqual(standings[0]['total_score'], 72)  # First place
        self.assertEqual(standings[1]['total_score'], 75)  # Second place
