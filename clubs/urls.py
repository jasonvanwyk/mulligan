from django.urls import path
from . import views

urlpatterns = [
    path('', views.ClubListView.as_view(), name='club-list'),
    path('create/', views.ClubCreateView.as_view(), name='club-create'),
    path('<int:pk>/', views.ClubDetailView.as_view(), name='club-detail'),
    path('<int:pk>/update/', views.ClubUpdateView.as_view(), name='club-update'),
    path('<int:pk>/delete/', views.ClubDeleteView.as_view(), name='club-delete'),
] 