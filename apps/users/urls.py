from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, user_profile

router = DefaultRouter()
router.register(r'users', UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('users/profile/', user_profile, name='user-profile'),
] 