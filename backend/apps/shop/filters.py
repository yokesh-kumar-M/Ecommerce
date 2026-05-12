from django_filters.rest_framework import FilterSet, filters
from .models import Product


class ProductFilter(FilterSet):
    min_price = filters.NumberFilter(field_name='unit_price', lookup_expr='gte')
    max_price = filters.NumberFilter(field_name='unit_price', lookup_expr='lte')
    in_stock = filters.BooleanFilter(method='filter_in_stock')

    class Meta:
        model = Product
        fields = ['collection_id', 'min_price', 'max_price', 'in_stock']

    def filter_in_stock(self, queryset, name, value):
        if value:
            return queryset.filter(inventory__gt=0)
        return queryset.filter(inventory=0)
