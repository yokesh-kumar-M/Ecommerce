from rest_framework import mixins, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet
from django.contrib.contenttypes.models import ContentType
from .models import LikedItem
from .serializers import LikedItemSerializer


class LikedItemViewSet(
    mixins.CreateModelMixin,
    mixins.DestroyModelMixin,
    mixins.ListModelMixin,
    GenericViewSet,
):
    serializer_class = LikedItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return LikedItem.objects.filter(user=self.request.user).select_related('content_type')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
