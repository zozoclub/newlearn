import redis
from pymongo import MongoClient
from Crawling import settings
from django.core.management.base import BaseCommand
print(settings.MONGO_USERNAME, settings.MONGO_PASSWORD)

uri = f"mongodb://{settings.MONGO_USERNAME}:{settings.MONGO_PASSWORD}@{settings.MONGO_HOST}:{settings.MONGO_PORT}/newlearn?authSource=admin"
client = MongoClient(uri)
try:
    client.admin.command('ping')
    print("연결 성공!")
except Exception as e:
    print(f"연결 실패: {e}")


class Command(BaseCommand):
    help = '몽고 db랑 redis에 중복되어있는지 확인하는 코드'

    def handle(self, *args, **options):
        try:
            client.admin.command('ping')
            print("연결 성공!")
        except Exception as e:
            print(f"연결 실패: {e}")