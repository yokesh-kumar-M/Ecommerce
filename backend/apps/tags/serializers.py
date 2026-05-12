from rest_framework import serializers
from .models import Tag, TagItem


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'label']


class TagItemSerializer(serializers.ModelSerializer):
    tag = TagSerializer(read_only=True)
    tag_id = serializers.PrimaryKeyRelatedField(
        queryset=Tag.objects.all(), source='tag', write_only=True
    )

    class Meta:
        model = TagItem
        fields = ['id', 'tag', 'tag_id']
