from django.urls import path
from . import views

urlpatterns = [
    path('add/',views.add_to_cart, name='Add to cart'),
    path('remove/', views.remove_from_cart, name='Remove'),
    path('bill/', views.billing, name='Bill'),
]