from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
from .views import register_user



urlpatterns = [
    path("register/", register_user, name="register"),
    path("login/", obtain_auth_token, name="login"),
]