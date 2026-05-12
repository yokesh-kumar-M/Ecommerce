from rest_framework.routers import DefaultRouter
from .views import LikedItemViewSet

router = DefaultRouter()
router.register('likes', LikedItemViewSet, basename='likes')

urlpatterns = router.urls
