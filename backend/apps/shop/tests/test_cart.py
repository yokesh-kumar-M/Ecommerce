import pytest
from decimal import Decimal
from rest_framework import status
from rest_framework.test import APIClient

from apps.shop.models import Cart, CartItem, Collection, Product


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def product(db):
    collection = Collection.objects.create(title='Test')
    return Product.objects.create(
        title='Widget',
        slug='widget',
        description='',
        unit_price=Decimal('9.99'),
        inventory=10,
        collection=collection,
    )


@pytest.mark.django_db
class TestCart:
    def test_create_cart(self, api_client):
        response = api_client.post('/api/carts/')
        assert response.status_code == status.HTTP_201_CREATED
        assert 'id' in response.data

    def test_retrieve_cart(self, api_client):
        cart = Cart.objects.create()
        response = api_client.get(f'/api/carts/{cart.id}/')
        assert response.status_code == status.HTTP_200_OK
        assert str(response.data['id']) == str(cart.id)

    def test_add_item_to_cart(self, api_client, product):
        cart = Cart.objects.create()
        response = api_client.post(
            f'/api/carts/{cart.id}/items/',
            {'product_id': product.id, 'quantity': 2},
        )
        assert response.status_code == status.HTTP_201_CREATED
        assert CartItem.objects.filter(cart=cart, product=product).count() == 1

    def test_add_existing_item_increments_quantity(self, api_client, product):
        cart = Cart.objects.create()
        CartItem.objects.create(cart=cart, product=product, quantity=1)
        response = api_client.post(
            f'/api/carts/{cart.id}/items/',
            {'product_id': product.id, 'quantity': 2},
        )
        assert response.status_code == status.HTTP_201_CREATED
        item = CartItem.objects.get(cart=cart, product=product)
        assert item.quantity == 3
