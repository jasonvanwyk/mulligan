from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, user_profile, UserRegistrationView, UserLoginView

router = DefaultRouter()
router.register(r'users', UserViewSet)

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='user-register'),
    path('login/', UserLoginView.as_view(), name='user-login'),
    path('profile/', user_profile, name='user-profile'),
    path('', include(router.urls)),
] 