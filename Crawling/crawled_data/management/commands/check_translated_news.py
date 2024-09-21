from datetime import datetime

import pandas as pd
import redis
from pymongo import MongoClient
import numpy as np
import logging
from django.core.management.base import BaseCommand
from Crawling import settings


# Redis 클라이언트 설정
redis_client = redis.StrictRedis(
    host=settings.REDIS_HOST,
    port=6379,
    db=1,
    username=settings.REDIS_USERNAME,  # 사용자 이름
    password=settings.REDIS_PASSWORD  # 비밀번호
)

# MongoDB 클라이언트 설정
mongo_client = MongoClient(f"mongodb://{settings.MONGO_USERNAME}:{settings.MONGO_PASSWORD}@{settings.MONGO_HOST}:{settings.MONGO_PORT}/")
db = mongo_client[settings.MONGO_DB_NAME]
collection = db[settings.MONGO_COLLECTION_NAME]


def process_translated_csv(filename, chunksize=5):
    """
    번역된 CSV 파일을 처리하여 중복 검사 및 유효성 검사를 한 후 MongoDB에 저장하는 함수
    """
    reader = pd.read_csv(filename, chunksize=chunksize)
    output_filename = "final_" + filename

    is_first_chunk = True

    for chunk in reader:
        rows_to_add = []

        for index, row in chunk.iterrows():
            print(f"Processing row: {index}")

            # 필드 검사
            url = row.get('url')
            translated_high = row.get('translated_high')
            translated_medium = row.get('translated_medium')
            translated_low = row.get('translated_low')
            translated_high_kor = row.get('translated_high_kor')
            translated_medium_kor = row.get('translated_medium')
            translated_low_kor = row.get('translated_low')

            # 필수 필드 확인 (url, translated fields)
            if not url or pd.isna(translated_high) or pd.isna(translated_medium) or pd.isna(translated_low) or pd.isna(translated_high_kor):
                print("null 있음요")
                continue

            # translated_high와 translated_high_kor의 문장 갯수 확인
            if len(translated_high.split('.')) != len(translated_high_kor.split('.')):
                print("high 갯수차이")
                continue

            if len(translated_medium.split('.')) != len(translated_medium_kor.split('.')):
                print("medium 갯수차이")
                continue

            if len(translated_low.split('.')) != len(translated_low_kor.split('.')):
                print("low 갯수차이")
                continue

            # Redis에서 URL 존재 여부 확인
            if redis_client.exists(url):
                print(f"이미 URL이 등록되어 있슴다.: {url}")
                continue
            else:
                redis_client.set(url, 1)

                row_dict = row.to_dict()

                # numpy 타입을 파이썬 기본 타입으로 변환
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
                    logging.error(f"Error inserting into MongoDB: {e}")

                rows_to_add.append(row)

        if rows_to_add:
            new_chunk = pd.DataFrame(rows_to_add)
            new_chunk.to_csv(output_filename, mode='a', header=is_first_chunk, index=False)
            is_first_chunk = False

class Command(BaseCommand):
    help = 'Processes translated news articles for duplicates and stores them in MongoDB'

    def handle(self, *args, **options):
        current_date = datetime.now().strftime("%Y%m%d")
        filename = f"translated_{current_date}.csv"
        process_translated_csv(filename)
        self.stdout.write(self.style.SUCCESS('Successfully processed translated news articles'))
