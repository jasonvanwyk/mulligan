from django.urls import path
from . import views

urlpatterns = [
    path('', views.GolferListView.as_view(), name='golfer-list'),
    path('create/', views.GolferCreateView.as_view(), name='golfer-create'),
    path('<int:pk>/', views.GolferDetailView.as_view(), name='golfer-detail'),
    path('<int:pk>/update/', views.GolferUpdateView.as_view(), name='golfer-update'),
    path('<int:pk>/delete/', views.GolferDeleteView.as_view(), name='golfer-delete'),
] 