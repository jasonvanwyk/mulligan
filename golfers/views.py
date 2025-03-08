from django.shortcuts import render, get_object_or_404
from rest_framework import generics, permissions
from .models import Golfer
from .serializers import GolferSerializer

# Create your views here.

class GolferListView(generics.ListAPIView):
    queryset = Golfer.objects.all()
    serializer_class = GolferSerializer
    permission_classes = [permissions.IsAuthenticated]

class GolferDetailView(generics.RetrieveAPIView):
    queryset = Golfer.objects.all()
    serializer_class = GolferSerializer
    permission_classes = [permissions.IsAuthenticated]

class GolferCreateView(generics.CreateAPIView):
    queryset = Golfer.objects.all()
    serializer_class = GolferSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class GolferUpdateView(generics.UpdateAPIView):
    queryset = Golfer.objects.all()
    serializer_class = GolferSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_update(self, serializer):
        serializer.save()

class GolferDeleteView(generics.DestroyAPIView):
    queryset = Golfer.objects.all()
    serializer_class = GolferSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_destroy(self, instance):
        instance.delete()
