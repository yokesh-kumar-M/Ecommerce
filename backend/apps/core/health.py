from django.db import connection
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny


@api_view(['GET'])
@permission_classes([AllowAny])
def health(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute('SELECT 1')
            cursor.fetchone()
        db_ok = True
    except Exception:
        db_ok = False

    status_code = 200 if db_ok else 503
    return JsonResponse(
        {
            'status': 'ok' if db_ok else 'degraded',
            'database': 'ok' if db_ok else 'unavailable',
            'service': 'shopnest-backend',
        },
        status=status_code,
    )


@api_view(['GET'])
@permission_classes([AllowAny])
def api_root(request):
    return JsonResponse(
        {
            'name': 'ShopNest API',
            'version': '1.0.0',
            'docs': request.build_absolute_uri('/api/docs/'),
            'schema': request.build_absolute_uri('/api/schema/'),
            'health': request.build_absolute_uri('/api/health/'),
            'endpoints': {
                'auth': request.build_absolute_uri('/api/auth/'),
                'products': request.build_absolute_uri('/api/products/'),
                'collections': request.build_absolute_uri('/api/collections/'),
                'carts': request.build_absolute_uri('/api/carts/'),
                'orders': request.build_absolute_uri('/api/orders/'),
            },
        }
    )
