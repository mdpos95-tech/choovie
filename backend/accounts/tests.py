from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status


class AccountTests(APITestCase):

    def test_user_can_register(self):
        response = self.client.post(
            "/api/auth/register/",
            {
                "username": "testuser",
                "email": "test@example.com",
                "password": "testpassword123",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username="testuser").exists())
        self.assertIn("token", response.data)



    def test_user_can_login(self):
        User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpassword123",
        )

        response = self.client.post(
            "/api/auth/login/",
            {
                "username": "testuser",
                "password": "testpassword123",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("token", response.data)        