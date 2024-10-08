import redis
import logging
from Crawling import settings

logger = logging.getLogger(__name__)

def get_redis_client():
    try:
        redis_client = redis.StrictRedis(
            host=settings.REDIS_HOST,
            port=6379,
            db=1,
            username=settings.REDIS_USERNAME,
            password=settings.REDIS_PASSWORD
        )
        response = redis_client.ping()
        logger.info(f"Redis 연결성공 : {response}")
        return redis_client
    except redis.exceptions.ConnectionError as e:
        logger.error(f"Redis 연결실패: {e}")
        raise e