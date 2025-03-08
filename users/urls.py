from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.UserRegistrationView.as_view(), name='user-register'),
    path('profile/', views.UserProfileView.as_view(), name='user-profile'),
    path('profile/update/', views.UserProfileUpdateView.as_view(), name='user-profile-update'),
    path('list/', views.UserListView.as_view(), name='user-list'),
    path('<int:pk>/', views.UserDetailView.as_view(), name='user-detail'),
    path('<int:pk>/update/', views.UserUpdateView.as_view(), name='user-update'),
    path('<int:pk>/delete/', views.UserDeleteView.as_view(), name='user-delete'),
] 