from django.shortcuts import render, get_object_or_404
from rest_framework import generics, permissions
from .models import Club
from .serializers import ClubSerializer

# Create your views here.

class ClubListView(generics.ListAPIView):
    queryset = Club.objects.all()
    serializer_class = ClubSerializer
    permission_classes = [permissions.IsAuthenticated]

class ClubDetailView(generics.RetrieveAPIView):
    queryset = Club.objects.all()
    serializer_class = ClubSerializer
    permission_classes = [permissions.IsAuthenticated]

class ClubCreateView(generics.CreateAPIView):
    queryset = Club.objects.all()
    serializer_class = ClubSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class ClubUpdateView(generics.UpdateAPIView):
    queryset = Club.objects.all()
    serializer_class = ClubSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_update(self, serializer):
        serializer.save()

class ClubDeleteView(generics.DestroyAPIView):
    queryset = Club.objects.all()
    serializer_class = ClubSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_destroy(self, instance):
        instance.delete()
