import redis
from Crawling import settings
from django.core.management.base import BaseCommand

try:
    redis_client = redis.StrictRedis(
        host=settings.REDIS_HOST,
        port=6379,
        db=1,
        username=settings.REDIS_USERNAME,
        password=settings.REDIS_PASSWORD
    )

    response = redis_client.ping()
    print(f"Redis 연결 성공: {response}")
except redis.ConnectionError as e:
    print(f"Redis 연결 실패: {e}")



class Command(BaseCommand):
    help = '몽고 db랑 redis에 중복되어있는지 확인하는 코드'

    def handle(self, *args, **options):
        redis_client.flushdb()
        print("모든 키가 성공적으로 삭제되었습니다.")