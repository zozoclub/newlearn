# check_translated_news.py

from datetime import datetime
import pandas as pd
import redis
from pymongo import MongoClient
import numpy as np
import logging
from django.core.management.base import BaseCommand
from Crawling import settings

# 로깅 설정
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
        logger.info(f"Redis 연결 성공: {response}")
        return redis_client
    except redis.ConnectionError as e:
        logger.error(f"Redis 연결 실패: {e}")
        raise e

def get_mongo_collection():
    uri = f"mongodb://{settings.MONGO_USERNAME}:{settings.MONGO_PASSWORD}@{settings.MONGO_HOST}:{settings.MONGO_PORT}/newlearn?authSource=admin"
    client = MongoClient(uri)
    try:
        client.admin.command('ping')
        logger.info("MongoDB 연결 성공!")
    except Exception as e:
        logger.error(f"MongoDB 연결 실패: {e}")
        raise e

    db = client['newlearn']
    collection = db['news']
    return collection

def process_translated_csv(filename, output_filename, redis_keys, chunksize=5):
    redis_client = get_redis_client()
    collection = get_mongo_collection()

    reader = pd.read_csv(filename, chunksize=chunksize)
    is_first_chunk = True

    try:
        for chunk in reader:
            rows_to_add = []

            for index, row in chunk.iterrows():
                logger.info(f"Processing row: {index}")

                url = row.get('url')
                title_eng = row.get('title_eng')
                translated_high = row.get('translated_high')
                translated_medium = row.get('translated_medium')
                translated_low = row.get('translated_low')
                translated_high_kor = row.get('translated_high_kor')
                translated_medium_kor = row.get('translated_medium_kor')
                translated_low_kor = row.get('translated_low_kor')

                if not url or pd.isna(translated_high) or pd.isna(translated_medium) or pd.isna(translated_low) or pd.isna(translated_high_kor) \
                        or pd.isna(translated_medium_kor) or pd.isna(translated_low_kor) or pd.isna(title_eng):
                    logger.warning("필수 값이 비어 있음")
                    continue

                if isinstance(translated_high, str) and isinstance(translated_high_kor, str):
                    if len(translated_high.split('.')) != len(translated_high_kor.split('.')):
                        logger.warning("high 문장 수 불일치")
                        continue
                else:
                    logger.warning("high 필드가 유효하지 않음")
                    continue

                if isinstance(translated_medium, str) and isinstance(translated_medium_kor, str):
                    if len(translated_medium.split('.')) != len(translated_medium_kor.split('.')):
                        logger.warning("medium 문장 수 불일치")
                        continue
                else:
                    logger.warning("medium 필드가 유효하지 않음")
                    continue

                if isinstance(translated_low, str) and isinstance(translated_low_kor, str):
                    if len(translated_low.split('.')) != len(translated_low_kor.split('.')):
                        logger.warning("low 문장 수 불일치")
                        continue
                else:
                    logger.warning("low 필드가 유효하지 않음")
                    continue

                if redis_client.exists(url):
                    logger.info(f"이미 등록된 URL: {url}")
                    continue
                else:
                    redis_client.set(url, 1)
                    redis_client.expire(url, 432000)
                    redis_keys.append(url)  # Redis에 추가된 키를 추적
                    row_dict = row.to_dict()

                    # numpy 타입 변환
                    for key in row_dict:
                        if pd.isna(row_dict[key]):
                            row_dict[key] = None
                        elif isinstance(row_dict[key], (np.int64, np.int32)):
                            row_dict[key] = int(row_dict[key])
                        elif isinstance(row_dict[key], (np.float64, np.float32)):
                            row_dict[key] = float(row_dict[key])
                        elif isinstance(row_dict[key], np.bool_):
                            row_dict[key] = bool(row_dict[key])

                    try:
                        collection.insert_one(row_dict)
                    except Exception as e:
                        logger.error(f"MongoDB 삽입 오류: {e}")
                        raise e

                    rows_to_add.append(row)

            if rows_to_add:
                new_chunk = pd.DataFrame(rows_to_add)
                new_chunk.to_csv(output_filename, mode='a', header=is_first_chunk, index=False)
                is_first_chunk = False

    except Exception as e:
        logger.error(f"process_translated_csv 중 오류 발생: {e}")
        raise e  # 오류 발생 시 예외를 발생시켜 상위 함수로 전달

class Command(BaseCommand):
    help = 'MongoDB와 Redis에서 중복 여부를 확인하는 코드'

    def add_arguments(self, parser):
        parser.add_argument('--filename', type=str, help="입력 CSV 파일 경로", required=True)
        parser.add_argument('--output', type=str, help="출력 CSV 파일 경로", required=True)
        parser.add_argument('--redis_keys', nargs='*', help="Redis에 추가된 키들을 추적하기 위한 리스트", required=True)

    def handle(self, *args, **options):
        filename = options['filename']
        output = options['output']
        redis_keys = options['redis_keys']

        try:
            process_translated_csv(filename, output, redis_keys)
            logger.info('성공적으로 처리했습니다.')
        except Exception as e:
            logger.error(f"handle 중 오류 발생: {e}")
            raise e  # 예외를 발생시켜 상위 함수로 전달
