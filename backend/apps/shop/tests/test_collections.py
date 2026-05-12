import pytest
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from model_bakery import baker

from apps.shop.models import Collection

User = get_user_model()


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def authenticate(api_client):
    def do_authenticate(is_staff=False):
        return api_client.force_authenticate(user=User(is_staff=is_staff))
    return do_authenticate


@pytest.mark.django_db
class TestCreateCollection:
    def test_if_user_is_anonymous_returns_401(self, api_client):
        response = api_client.post('/api/collections/', {'title': 'a'})
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_if_user_is_not_admin_returns_403(self, api_client, authenticate):
        authenticate(is_staff=False)
        response = api_client.post('/api/collections/', {'title': 'a'})
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_if_data_is_invalid_returns_400(self, api_client, authenticate):
        authenticate(is_staff=True)
        response = api_client.post('/api/collections/', {'title': ''})
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data['errors']['title'] is not None

    def test_if_data_is_valid_returns_201(self, api_client, authenticate):
        authenticate(is_staff=True)
        response = api_client.post('/api/collections/', {'title': 'a'})
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['id'] > 0


@pytest.mark.django_db
class TestRetrieveCollection:
    def test_if_collection_exists_returns_200(self, api_client):
        collection = baker.make(Collection)
        response = api_client.get(f'/api/collections/{collection.id}/')
        assert response.status_code == status.HTTP_200_OK
        assert response.data == {
            'id': collection.id,
            'title': collection.title,
            'products_count': 0,
        }
