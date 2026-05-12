from django.db import models
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey


class Tag(models.Model):
    label = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.label

    class Meta:
        ordering = ['label']


class TagItem(models.Model):
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE, related_name='items')
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey()

    def __str__(self):
        return f'{self.tag.label} → {self.content_object}'

    class Meta:
        unique_together = [['tag', 'content_type', 'object_id']]
        indexes = [
            models.Index(fields=['content_type', 'object_id']),
        ]
