from django.contrib import admin
from .models import Tag, TagItem


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ['label']
    search_fields = ['label']


@admin.register(TagItem)
class TagItemAdmin(admin.ModelAdmin):
    list_display = ['tag', 'content_type', 'object_id']
    list_filter = ['tag', 'content_type']
