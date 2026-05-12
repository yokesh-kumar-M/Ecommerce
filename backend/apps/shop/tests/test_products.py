import pytest
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from model_bakery import baker

from apps.shop.models import Product, Collection

User = get_user_model()


@pytest.fixture
def api_client():
    return APIClient()


@pytest.mark.django_db
class TestListProducts:
    def test_returns_200(self, api_client):
        response = api_client.get('/api/products/')
        assert response.status_code == status.HTTP_200_OK

    def test_returns_paginated_results(self, api_client):
        baker.make(Product, _quantity=5)
        response = api_client.get('/api/products/')
        assert response.status_code == status.HTTP_200_OK
        assert 'results' in response.data
        assert 'count' in response.data


@pytest.mark.django_db
class TestRetrieveProduct:
    def test_if_product_exists_returns_200(self, api_client):
        product = baker.make(Product)
        response = api_client.get(f'/api/products/{product.id}/')
        assert response.status_code == status.HTTP_200_OK
        assert response.data['id'] == product.id

    def test_if_product_does_not_exist_returns_404(self, api_client):
        response = api_client.get('/api/products/9999/')
        assert response.status_code == status.HTTP_404_NOT_FOUND
