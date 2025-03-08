from django.urls import path
from . import views

urlpatterns = [
    # Tournament management
    path('', views.TournamentListView.as_view(), name='tournament-list'),
    path('create/', views.TournamentCreateView.as_view(), name='tournament-create'),
    path('<int:pk>/', views.TournamentDetailView.as_view(), name='tournament-detail'),
    path('<int:pk>/update/', views.TournamentUpdateView.as_view(), name='tournament-update'),
    path('<int:pk>/delete/', views.TournamentDeleteView.as_view(), name='tournament-delete'),
    
    # Tournament participants
    path('<int:pk>/participants/', views.TournamentParticipantListView.as_view(), name='tournament-participant-list'),
    path('<int:pk>/participants/add/', views.TournamentParticipantCreateView.as_view(), name='tournament-participant-create'),
    path('<int:pk>/participants/<int:participant_pk>/', views.TournamentParticipantDetailView.as_view(), name='tournament-participant-detail'),
    path('<int:pk>/participants/<int:participant_pk>/delete/', views.TournamentParticipantDeleteView.as_view(), name='tournament-participant-delete'),
    
    # Tournament results
    path('<int:pk>/results/', views.TournamentResultListView.as_view(), name='tournament-result-list'),
    path('<int:pk>/results/add/', views.TournamentResultCreateView.as_view(), name='tournament-result-create'),
    path('<int:pk>/results/<int:result_pk>/', views.TournamentResultDetailView.as_view(), name='tournament-result-detail'),
    path('<int:pk>/results/<int:result_pk>/update/', views.TournamentResultUpdateView.as_view(), name='tournament-result-update'),
    path('<int:pk>/results/<int:result_pk>/delete/', views.TournamentResultDeleteView.as_view(), name='tournament-result-delete'),
    
    # Tournament points
    path('<int:pk>/points/', views.TournamentPointsListView.as_view(), name='tournament-points-list'),
    path('<int:pk>/points/add/', views.TournamentPointsCreateView.as_view(), name='tournament-points-create'),
    path('<int:pk>/points/<int:points_pk>/', views.TournamentPointsDetailView.as_view(), name='tournament-points-detail'),
    path('<int:pk>/points/<int:points_pk>/update/', views.TournamentPointsUpdateView.as_view(), name='tournament-points-update'),
    path('<int:pk>/points/<int:points_pk>/delete/', views.TournamentPointsDeleteView.as_view(), name='tournament-points-delete'),
    
    # Tournament standings
    path('<int:pk>/standings/', views.TournamentStandingsView.as_view(), name='tournament-standings'),
    path('<int:pk>/standings/pdf/', views.TournamentStandingsPDFView.as_view(), name='tournament-standings-pdf'),
] 