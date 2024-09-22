from datetime import datetime
import pandas as pd
import redis
from pymongo import MongoClient
import numpy as np
import logging
from django.core.management.base import BaseCommand
from Crawling import settings


try:
    redis_client = redis.StrictRedis(
        host='54.180.158.165',
        port=6379,
        db=1,
        username=settings.REDIS_USERNAME,
        password=settings.REDIS_PASSWORD
    )

    # Redis ping 테스트
    response = redis_client.ping()
    print(f"Redis 연결 성공: {response}")
except redis.ConnectionError as e:
    print(f"Redis 연결 실패: {e}")

uri = f"mongodb://{settings.MONGO_USERNAME}:{settings.MONGO_PASSWORD}@{settings.MONGO_HOST}:{settings.MONGO_PORT}/newlearn?authSource=admin"
client = MongoClient(uri)
try:
    client.admin.command('ping')
    print("MongoDB 연결 성공!")
except Exception as e:
    print(f"MongoDB 연결 실패: {e}")

db = client['newlearn']
collection = db['news']

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

            url = row.get('url')
            translated_high = row.get('translated_high')
            translated_medium = row.get('translated_medium')
            translated_low = row.get('translated_low')
            translated_high_kor = row.get('translated_high_kor')
            translated_medium_kor = row.get('translated_medium_kor')
            translated_low_kor = row.get('translated_low_kor')

            if not url or pd.isna(translated_high) or pd.isna(translated_medium) or pd.isna(translated_low) or pd.isna(translated_high_kor) \
                    or pd.isna(translated_medium_kor) or pd.isna(translated_low_kor):
                print("필수 값이 비어 있음")
                continue

            if isinstance(translated_high, str) and isinstance(translated_high_kor, str):
                if len(translated_high.split('.')) != len(translated_high_kor.split('.')):
                    print("high 문장 수 불일치")
                    continue
            else:
                print("high 필드가 유효하지 않음")
                continue

            if isinstance(translated_medium, str) and isinstance(translated_medium_kor, str):
                if len(translated_medium.split('.')) != len(translated_medium_kor.split('.')):
                    print("medium 문장 수 불일치")
                    continue
            else:
                print("medium 필드가 유효하지 않음")
                continue

            if isinstance(translated_low, str) and isinstance(translated_low_kor, str):
                if len(translated_low.split('.')) != len(translated_low_kor.split('.')):
                    print("low 문장 수 불일치")
                    continue
            else:
                print("low 필드가 유효하지 않음")
                continue

            if redis_client.exists(url):
                print(f"이미 등록된 URL: {url}")
                continue
            else:
                redis_client.set(url, 1)

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
                    logging.error(f"MongoDB 삽입 오류: {e}")

                rows_to_add.append(row)

        if rows_to_add:
            new_chunk = pd.DataFrame(rows_to_add)
            new_chunk.to_csv(output_filename, mode='a', header=is_first_chunk, index=False)
            is_first_chunk = False

class Command(BaseCommand):
    help = 'MongoDB와 Redis에서 중복 여부를 확인하는 코드'

    def handle(self, *args, **options):
        current_date = datetime.now().strftime("%Y%m%d")
        filename = f"translated_{current_date}.csv"
        process_translated_csv(filename)
        self.stdout.write(self.style.SUCCESS('성공적으로 처리했습니다.'))
