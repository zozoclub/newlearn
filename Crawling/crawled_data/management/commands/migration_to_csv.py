import os
import shutil
from datetime import datetime
import random
import boto3
import pandas as pd
from pymongo import MongoClient
import logging
from Crawling import settings
from django.core.management.base import BaseCommand
from sqlalchemy import create_engine
import requests

# 로깅 설정
logger = logging.getLogger(__name__)

# MongoDB 연결 설정
uri = f"mongodb://{settings.MONGO_USERNAME}:{settings.MONGO_PASSWORD}@{settings.MONGO_HOST}:{settings.MONGO_PORT}/newlearn?authSource=admin"
client = MongoClient(uri)

db = client['newlearn']
collection = db['news']

# MySQL 연결 설정
engine = 'mysql+mysqlconnector'
user = settings.MYSQL_USER
passwd = settings.MYSQL_PWD
host = settings.MYSQL_HOST
port = settings.MYSQL_PORT
db_name = settings.MYSQL_DB_NAME

db = create_engine(f'mysql+mysqlconnector://{settings.MYSQL_USER}:{settings.MYSQL_PWD}@{settings.MYSQL_HOST}:{settings.MYSQL_PORT}/{settings.MYSQL_DB_NAME}?charset=utf8')
class Command(BaseCommand):
    help = 'MongoDB와 Redis에 중복 여부를 확인하는 코드'


    def handle(self, *args, **options):
        #csv 파일 바로 mysql로 옮길때
        #csv_file_path = 'path/to/your/final.csv'  # 실제 CSV 파일 경로로 변경하세요
        # CSV 파일을 읽어서 DataFrame으로 변환
        #df = pd.read_csv(csv_file_path)

        data = list(collection.find())
        df = pd.DataFrame(data)

        if '_id' in df.columns:
            df = df.drop(columns=['_id'])

        df['hit'] = 0
        if 'section' in df.columns:
            df = df.rename(columns={'section': 'category_id'})

        current_date = datetime.now().strftime("%y%m%d")
        base_folder = os.path.join("crawl_data", current_date)
        os.makedirs(base_folder, exist_ok=True)
        csv_file_path = os.path.join(base_folder, 'final.csv')

        df.to_csv(csv_file_path, index=False, encoding='utf-8-sig')
        logger.info(f"CSV 파일이 저장되었습니다: {csv_file_path}")

        # S3 서버에 저장하는 로직
        s3 = s3_connection()

        bucket = "nonakim"
        random_value = random.randint(1000, 9999)
        base_s3_key = f"data/{current_date}/final_{random_value}.csv"

        s3_key = s3_get_file_name(s3, bucket, base_s3_key)

        if s3_put_object(s3, bucket, csv_file_path, s3_key):
            logger.info(f"S3에 파일이 성공적으로 저장되었습니다: {s3_key}")
        else:
            logger.error("S3 업로드에 실패했습니다.")

        #엘라스틱 먼저 비우기
        call_spring_delete_api()

        # MySQL 작업
        df.to_sql(name='news', con=db, if_exists='append', index=False)
        logger.info("MySQL에 데이터 저장 완료")

        clear_mongodb_collection()

        # CSV 삭제
        shutil.rmtree(base_folder, ignore_errors=True)
        logger.info("CSV 파일 삭제 완료")

def s3_connection():
    try:
        s3 = boto3.client(
            service_name='s3',
            region_name=settings.S3_REGION,
            aws_access_key_id=settings.S3_ACCESS_KEY,
            aws_secret_access_key=settings.S3_SECRET_KEY
        )
    except Exception as e:
        logger.error(f"S3 연결 실패: {e}")
    else:
        logger.info("S3 버킷에 연결되었습니다.")
        return s3

def s3_get_file_name(s3, bucket, base_key):
    if s3_check_file_exists(s3, bucket, f"{base_key}1.csv"):
        return f"{base_key}2.csv"
    else:
        return f"{base_key}1.csv"

def s3_check_file_exists(s3, bucket, s3_key):
    """
    S3에서 파일 존재 여부 확인
    :param s3: 연결된 S3 객체 (boto3 client)
    :param bucket: 버킷명
    :param s3_key: 확인할 파일의 S3 경로
    :return: 존재하면 True, 존재하지 않으면 False 반환
    """
    try:
        response = s3.list_objects_v2(Bucket=bucket, Prefix=s3_key)
        for obj in response.get('Contents', []):
            if obj['Key'] == s3_key:
                return True
    except Exception as e:
        logger.error(f"S3에서 파일 확인 중 오류 발생: {e}")
    return False

def s3_put_object(s3, bucket, filepath, access_key):
    try:
        s3.upload_file(
            Filename=filepath,
            Bucket=bucket,
            Key=access_key,
        )
        logger.info(f"파일이 S3에 업로드되었습니다: {access_key}")
    except Exception as e:
        logger.error(f"S3 업로드 실패: {e}")
        return False
    return True

def clear_mongodb_collection():
    try:
        collection.delete_many({})
        logger.info("MongoDB 컬렉션을 성공적으로 비웠습니다.")
    except Exception as e:
        logger.error(f"MongoDB 컬렉션 비우기 오류: {e}")

def call_spring_delete_api():
    try:
        response = requests.delete('http://localhost:8080/api/search/delete')

        if response.status_code == 200:
            logger.info("제대로 삭제되었씁니다.")
        else:
            logger.info("삭제 실패")
    except Exception as e:
        logger.error(e)
