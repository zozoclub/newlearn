# main.py

import shutil
from datetime import datetime
import os
import logging

import redis
from django.core.management import call_command
from django.core.management.base import BaseCommand
from pymongo import MongoClient

from Crawling import settings
# 로깅 설정
logger = logging.getLogger(__name__)
uri = f"mongodb://{settings.MONGO_USERNAME}:{settings.MONGO_PASSWORD}@{settings.MONGO_HOST}:{settings.MONGO_PORT}/newlearn?authSource=admin"
client = MongoClient(uri)

db = client['newlearn']
collection = db['news']

class Command(BaseCommand):
    help = "카테고리 별로 뉴스 크롤링 후 번역 및 mongodb 저장을 처리하는 과정"

    def handle(self, *args, **kwargs):
        current_date = datetime.now().strftime("%y%m%d")
        base_folder = os.path.join("crawl_data", current_date)

        if not os.path.exists(base_folder):
            os.makedirs(base_folder)

        error_occurred = False  # 오류 발생 여부를 추적하는 변수
        redis_keys = []  # Redis에 추가된 키들을 추적하기 위한 리스트

        try:
            sids = [100, 101, 102, 103, 104, 105]
            for sid in sids:
                try:
                    logger.info(f'크롤링 작업 시작 for SID: {sid}...')

                    crawl_filename = f"{current_date}_sid_{sid}.csv"
                    crawl_file_path = os.path.join(base_folder, crawl_filename)

                    # 크롤링 작업 실행
                    call_command('crawl_news', str(sid), '--output', crawl_file_path)
                    logger.info(f'크롤링 완료 SID: {sid}, saved to {crawl_file_path}')

                    # 번역 작업 후 저장할 파일명
                    translated_filename = f"translated_{current_date}_sid_{sid}.csv"
                    translated_file_path = os.path.join(base_folder, translated_filename)

                    logger.info(f'번역 작업 시작 SID: {sid}...')
                    call_command('translate_news', '--filename', crawl_file_path, '--output', translated_file_path)
                    logger.info(f'번역 완료 SID: {sid}, translated file: {translated_file_path}')

                    # 중복 검사 및 MongoDB 저장 시작
                    final_filename = f"final_translated_{current_date}_sid_{sid}.csv"
                    final_file_path = os.path.join(base_folder, final_filename)

                    logger.info(f'중복 검사 및 MongoDB 저장 시작 SID: {sid}...')
                    # check_translated_news 커맨드에 redis_keys를 전달하여 저장된 키들을 추적
                    call_command('check_translated_news', '--filename', translated_file_path, '--output', final_file_path, '--redis_keys', redis_keys)
                    logger.info(f'MongoDB 저장 완료 SID: {sid}, final file: {final_file_path}')

                except Exception as e:
                    logger.error(f'작업 중 오류 발생 SID: {sid}: {e}')
                    error_occurred = True
                    break  # 오류 발생 시 반복문 종료

            if error_occurred:
                logger.info('오류가 발생하여 롤백 작업을 수행합니다.')
                self.rollback(base_folder, redis_keys)
            else:
                # 모든 작업이 성공적으로 완료된 경우 후속 작업 수행
                shutil.rmtree(base_folder, ignore_errors=True)
                call_command('migration_to_csv')
                logger.info('MongoDB 데이터를 MySQL로 마이그레이션 완료')

        except Exception as e:
            logger.error(f'전체 작업 중 오류 발생: {e}')
            self.rollback(base_folder, redis_keys)

    def rollback(self, base_folder, redis_keys):
        # MongoDB 데이터 삭제
        try:
            clear_mongodb_collection()
            logger.info("MongoDB 데이터를 롤백했습니다.")
        except Exception as e:
            logger.error(f"MongoDB 롤백 중 오류 발생: {e}")

        # Redis 키 삭제
        try:
            redis_client = get_redis_client()
            for key in redis_keys:
                redis_client.delete(key)
            logger.info("Redis 키를 롤백했습니다.")
        except Exception as e:
            logger.error(f"Redis 롤백 중 오류 발생: {e}")

        # 해당 날짜의 폴더 삭제
        try:
            shutil.rmtree(base_folder, ignore_errors=True)
            logger.info(f"{base_folder} 폴더를 삭제했습니다.")
        except Exception as e:
            logger.error(f"폴더 삭제 중 오류 발생: {e}")

def clear_mongodb_collection():
    try:
        collection.delete_many({})
        logger.info("MongoDB 컬렉션을 성공적으로 비웠습니다.")
    except Exception as e:
        logger.error(f"MongoDB 컬렉션 비우기 오류: {e}")

def get_redis_client():
    # Redis 클라이언트 생성 코드 (기존 코드 사용)
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
