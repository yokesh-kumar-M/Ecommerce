from django.contrib import admin
from django.db.models import Count
from django.urls import reverse
from django.utils.html import format_html, urlencode
from . import models


class InventoryFilter(admin.SimpleListFilter):
    title = 'inventory'
    parameter_name = 'inventory'

    LOW_STOCK = '<10'
    OK_STOCK = '>=10'

    def lookups(self, request, model_admin):
        return [(self.LOW_STOCK, 'Low'), (self.OK_STOCK, 'OK')]

    def queryset(self, request, queryset):
        if self.value() == self.LOW_STOCK:
            return queryset.filter(inventory__lt=10)
        if self.value() == self.OK_STOCK:
            return queryset.filter(inventory__gte=10)


class ProductImageInline(admin.TabularInline):
    model = models.ProductImage
    extra = 1
    readonly_fields = ['thumbnail']

    def thumbnail(self, instance):
        if instance.image.name != '':
            return format_html(f'<img src="{instance.image.url}" class="thumbnail" />')
        return ''


@admin.register(models.Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['title', 'unit_price', 'inventory_status', 'collection_title']
    list_editable = ['unit_price']
    list_per_page = 20
    list_select_related = ['collection']
    list_filter = ['collection', 'last_update', InventoryFilter]
    search_fields = ['title']
    prepopulated_fields = {'slug': ['title']}
    autocomplete_fields = ['collection']
    inlines = [ProductImageInline]
    ordering = ['title']

    @admin.display(ordering='inventory')
    def inventory_status(self, product):
        if product.inventory < 10:
            return 'Low'
        return 'OK'

    def collection_title(self, product):
        return product.collection.title

    class Media:
        css = {'all': ['shop/styles.css']}


@admin.register(models.Collection)
class CollectionAdmin(admin.ModelAdmin):
    list_display = ['title', 'products_count']
    search_fields = ['title']

    @admin.display(ordering='products_count')
    def products_count(self, collection):
        url = (
            reverse('admin:shop_product_changelist')
            + '?'
            + urlencode({'collection__id': str(collection.id)})
        )
        return format_html('<a href="{}">{} Products</a>', url, collection.products_count)

    def get_queryset(self, request):
        return super().get_queryset(request).annotate(products_count=Count('products'))


class OrderItemInline(admin.TabularInline):
    model = models.OrderItem
    autocomplete_fields = ['product']
    extra = 0
    min_num = 1
    max_num = 20


@admin.register(models.Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'placed_at', 'payment_status', 'customer']
    list_editable = ['payment_status']
    list_per_page = 20
    list_select_related = ['customer__user']
    list_filter = ['payment_status', 'placed_at']
    autocomplete_fields = ['customer']
    inlines = [OrderItemInline]
    ordering = ['-placed_at']


@admin.register(models.Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ['first_name', 'last_name', 'email', 'membership', 'orders_count']
    list_editable = ['membership']
    list_per_page = 20
    list_select_related = ['user']
    list_filter = ['membership']
    search_fields = ['user__first_name__istartswith', 'user__last_name__istartswith']
    ordering = ['user__first_name', 'user__last_name']

    def first_name(self, customer):
        return customer.user.first_name

    def last_name(self, customer):
        return customer.user.last_name

    def email(self, customer):
        return customer.user.email

    @admin.display(ordering='orders_count')
    def orders_count(self, customer):
        url = (
            reverse('admin:shop_order_changelist')
            + '?'
            + urlencode({'customer__id': str(customer.id)})
        )
        return format_html('<a href="{}">{} Orders</a>', url, customer.orders_count)

    def get_queryset(self, request):
        return super().get_queryset(request).annotate(orders_count=Count('orders'))


@admin.register(models.Promotion)
class PromotionAdmin(admin.ModelAdmin):
    list_display = ['description', 'discount']
    list_editable = ['discount']


@admin.register(models.Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ['id', 'created_at']
    readonly_fields = ['id', 'created_at']


@admin.register(models.ProductReview)
class ProductReviewAdmin(admin.ModelAdmin):
    list_display = ['product', 'name', 'rating', 'created_at']
    list_filter = ['rating']
    search_fields = ['product__title', 'name']
