import os
import shutil
from datetime import datetime
import boto3
import pandas as pd
from pymongo import MongoClient
from Crawling import settings
from django.core.management.base import BaseCommand
from sqlalchemy import create_engine

#이제 나온 몽고디비 데이터를 mysql로 마이그레이션
#마이그레이션 할땐, 몽고디비내용을 csv로 저장한다음
#mysql에 import 한 다음 csv 파일 s3서버에 저장하고 삭제
uri = f"mongodb://{settings.MONGO_USERNAME}:{settings.MONGO_PASSWORD}@{settings.MONGO_HOST}:{settings.MONGO_PORT}/newlearn?authSource=admin"
client = MongoClient(uri)

db = client['newlearn']
collection = db['news']

engine = 'mysql+mysqlconnector'
user = settings.MYSQL_USER
passwd = settings.MYSQL_PWD
host = settings.MYSQL_HOST
port = settings.MYSQL_PORT
db_name = settings.MYSQL_DB_NAME

db = create_engine(f'{engine}://{user}:{passwd}@{host}:{port}/{db_name}?charset=utf8')

class Command(BaseCommand):
    help = '몽고 db랑 redis에 중복되어있는지 확인하는 코드'

    def handle(self, *args, **options):
        data = list(collection.find())
        df = pd.DataFrame(data)

        if '_id' in df.columns:
            df = df.drop(columns=['_id'])

        df['hit'] = 0
        if 'section' in df.columns:
            df = df.rename(columns={'section': 'category_id'})

        current_date = datetime.now().strftime("%d%m%y")
        base_folder = os.path.join("crawl_data", current_date)
        os.makedirs(base_folder, exist_ok=True)
        csv_file_path = os.path.join(base_folder, 'final.csv')

        df.to_csv(csv_file_path, index=False, encoding='utf-8-sig')
        print(f"CSV 파일이 저장되었습니다: {csv_file_path}")

        #s3서버에 저장 하는 로직
        s3 = s3_connection()

        bucket = "nonakim"
        base_s3_key = f"data/{current_date}/final.csv"

        s3_key = s3_get_file_name(s3, bucket, base_s3_key)

        if s3_put_object(s3, bucket, csv_file_path, s3_key):
            print(f"S3에 파일이 성공적으로 저장되었습니다: {s3_key}")
        else:
            print("S3 업로드에 실패했습니다.")

        ##mysql 작업
        df.to_sql(name='news', con=db, if_exists='append', index=False)

        #이제 csv 삭제
        shutil.rmtree(base_folder, ignore_errors=True)\
        #

def s3_connection():
    try:
        s3 = boto3.client(
            service_name='s3',
            region_name=settings.S3_REGION,
            aws_access_key_id=settings.S3_ACCESS_KEY,
            aws_secret_access_key=settings.S3_SECRET_KEY
        )
    except Exception as e:
        print(e)
    else:
        print("s3 bucket conneted!")
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
        print(f"Error checking S3: {e}")
    return False

def s3_put_object(s3, bucket, filepath, access_key):
    try:
        s3.upload_file(
            Filename=filepath,
            Bucket=bucket,
            Key=access_key,
        )
        print(f"File uploaded to S3: {access_key}")
    except Exception as e:
        print(f"S3 upload failed: {e}")
        return False
    return True