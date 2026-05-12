from rest_framework import serializers
from django.contrib.contenttypes.models import ContentType
from .models import LikedItem


class LikedItemSerializer(serializers.ModelSerializer):
    content_type = serializers.SlugRelatedField(
        queryset=ContentType.objects.all(), slug_field='model'
    )

    class Meta:
        model = LikedItem
        fields = ['id', 'content_type', 'object_id', 'created_at']
        read_only_fields = ['id', 'created_at']

    def create(self, validated_data):
        user = self.context['request'].user
        return LikedItem.objects.get_or_create(user=user, **validated_data)[0]
