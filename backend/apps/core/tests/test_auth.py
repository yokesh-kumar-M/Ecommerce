import pytest
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

User = get_user_model()


@pytest.fixture
def api_client():
    return APIClient()


@pytest.mark.django_db
class TestHealth:
    def test_health_endpoint_returns_ok(self, api_client):
        response = api_client.get('/api/health/')
        assert response.status_code == status.HTTP_200_OK
        assert response.json()['status'] == 'ok'

    def test_api_root_lists_endpoints(self, api_client):
        response = api_client.get('/api/')
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data['name'] == 'ShopNest API'
        assert 'endpoints' in data


@pytest.mark.django_db
class TestRegister:
    def test_register_creates_user(self, api_client):
        payload = {
            'email': 'newuser@example.com',
            'username': 'newuser',
            'first_name': 'New',
            'last_name': 'User',
            'password': 'StrongPass123!',
            'password2': 'StrongPass123!',
        }
        response = api_client.post('/api/auth/register/', payload)
        assert response.status_code == status.HTTP_201_CREATED
        assert User.objects.filter(email='newuser@example.com').exists()

    def test_register_rejects_mismatched_passwords(self, api_client):
        payload = {
            'email': 'mismatch@example.com',
            'username': 'mismatch',
            'first_name': 'M',
            'last_name': 'M',
            'password': 'StrongPass123!',
            'password2': 'DifferentPass456!',
        }
        response = api_client.post('/api/auth/register/', payload)
        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
class TestJWTToken:
    def test_obtain_token_with_valid_credentials(self, api_client):
        User.objects.create_user(
            email='login@example.com',
            username='login',
            password='StrongPass123!',
        )
        response = api_client.post(
            '/api/auth/token/',
            {'email': 'login@example.com', 'password': 'StrongPass123!'},
        )
        assert response.status_code == status.HTTP_200_OK
        assert 'access' in response.data
        assert 'refresh' in response.data

    def test_obtain_token_rejects_bad_credentials(self, api_client):
        response = api_client.post(
            '/api/auth/token/',
            {'email': 'nope@example.com', 'password': 'wrong'},
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_me_endpoint_requires_auth(self, api_client):
        response = api_client.get('/api/auth/me/')
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_me_endpoint_returns_authenticated_user(self, api_client):
        user = User.objects.create_user(
            email='me@example.com',
            username='me',
            password='StrongPass123!',
            first_name='Me',
            last_name='User',
        )
        api_client.force_authenticate(user=user)
        response = api_client.get('/api/auth/me/')
        assert response.status_code == status.HTTP_200_OK
        assert response.data['email'] == 'me@example.com'
