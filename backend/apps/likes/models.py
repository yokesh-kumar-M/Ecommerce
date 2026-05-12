from django.db import models
from django.conf import settings
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey


class LikedItem(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='liked_items')
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user} liked {self.content_object}'

    class Meta:
        unique_together = [['user', 'content_type', 'object_id']]
        indexes = [
            models.Index(fields=['content_type', 'object_id']),
        ]
