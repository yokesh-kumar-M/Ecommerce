from decimal import Decimal
from django.core.management.base import BaseCommand
from django.db import transaction
from django.contrib.auth import get_user_model
from django.utils.text import slugify

from apps.shop.models import Collection, Product

User = get_user_model()

COLLECTIONS = [
    ('Electronics', [
        ('Wireless Headphones', 79.99, 'Noise-cancelling wireless headphones with 30-hour battery life.', 25,
         'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'),
        ('Smart Watch', 199.99, 'Track your fitness, notifications, and more in style.', 18,
         'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'),
        ('Bluetooth Speaker', 49.99, 'Portable Bluetooth speaker with deep bass and 12-hour playtime.', 40,
         'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80'),
        ('USB-C Hub', 34.99, '7-in-1 USB-C hub with HDMI, ethernet, and SD card reader.', 60,
         'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=800&q=80'),
    ]),
    ('Apparel', [
        ('Classic Tee', 19.99, 'Soft 100% cotton tee in versatile colors. Built to last.', 100,
         'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80'),
        ('Denim Jacket', 89.99, 'Timeless denim jacket — pairs with everything.', 30,
         'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=800&q=80'),
        ('Wool Sweater', 65.00, 'Warm wool-blend sweater for cooler days.', 22,
         'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80'),
    ]),
    ('Home', [
        ('Ceramic Mug Set', 24.99, 'Set of 4 ceramic mugs, dishwasher safe.', 50,
         'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80'),
        ('Linen Throw Pillow', 29.99, 'Soft linen pillow cover, machine washable.', 35,
         'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&q=80'),
        ('Desk Lamp', 44.99, 'Adjustable LED desk lamp with 5 brightness levels.', 28,
         'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80'),
    ]),
    ('Books', [
        ('The Pragmatic Programmer', 32.50, 'Classic software engineering reference.', 15,
         'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80'),
        ('Atomic Habits', 18.99, 'Build good habits and break bad ones.', 45,
         'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&q=80'),
    ]),
]


class Command(BaseCommand):
    help = 'Seed the database with demo collections and products'

    def add_arguments(self, parser):
        parser.add_argument('--admin-email', default='admin@shopnest.com')
        parser.add_argument('--admin-password', default='AdminPass123!')

    @transaction.atomic
    def handle(self, *args, **options):
        admin_email = options['admin_email']
        admin_password = options['admin_password']

        if not User.objects.filter(email=admin_email).exists():
            User.objects.create_superuser(
                email=admin_email,
                username='admin',
                password=admin_password,
                first_name='Admin',
                last_name='User',
            )
            self.stdout.write(self.style.SUCCESS(f'Created admin: {admin_email}'))

        created = 0
        for collection_title, products in COLLECTIONS:
            collection, _ = Collection.objects.get_or_create(title=collection_title)
            for title, price, description, inventory, _image_url in products:
                slug = slugify(title)
                if Product.objects.filter(slug=slug).exists():
                    continue
                Product.objects.create(
                    title=title,
                    slug=slug,
                    description=description,
                    unit_price=Decimal(str(price)),
                    inventory=inventory,
                    collection=collection,
                )
                created += 1

        self.stdout.write(
            self.style.SUCCESS(
                f'Seed complete. Created {created} new products across {len(COLLECTIONS)} collections.'
            )
        )
