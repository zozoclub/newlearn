from django.db import models

class News(models.Model):
    news_id = models.BigAutoField(primary_key=True)
    category_id = models.BigIntegerField()
    title = models.TextField()
    content = models.TextField()
    content_translation_high = models.TextField(blank=True, null=True)
    content_translation_medium = models.TextField(blank=True, null=True)
    content_translation_low = models.TextField(blank=True, null=True)
    content_korean_high = models.TextField(blank=True, null=True)
    content_korean_medium = models.TextField(blank=True, null=True)
    content_korean_low = models.TextField(blank=True, null=True)
    press = models.CharField(max_length=255)
    published_date = models.DateTimeField(blank=True, null=True)
    thumbnail_image_url = models.TextField(blank=True, null=True)
    hit = models.BigIntegerField(default=0)

    class Meta:
        db_table = 'news'

class Category(models.Model):
    category_id = models.BigAutoField(primary_key=True)
    category_name = models.CharField(max_length=255)

    class Meta:
        db_table = 'categories'
