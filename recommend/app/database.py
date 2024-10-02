from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
from pymongo import MongoClient
import os

load_dotenv()   # .env 파일 내 환경 변수 로드

# MySQL 환경 변수 로드
MYSQL_USERNAME = os.getenv("MYSQL_USERNAME")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD")
MYSQL_HOST = os.getenv("MYSQL_HOST")
MYSQL_PORT = os.getenv("MYSQL_PORT")
MYSQL_DBNAME = os.getenv("MYSQL_DBNAME")

# MySQL 연결 설정
DATABASE_URL = f"mysql+pymysql://{MYSQL_USERNAME}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DBNAME}"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# MongoDB 환경 변수 로드
MONGO_URL = os.getenv("MONGO_URL")
MONGO_DBNAME = os.getenv("MONGO_DBNAME")
MONGO_TABLE_NAME = os.getenv("MONGO_TABLE_NAME")

# MongoDB 연결 설정
mongo_client = MongoClient(MONGO_URL)

# MongoDB 데이터 베이스 선택
mongo_db = mongo_client[MONGO_DBNAME]
user_news_click = mongo_db[MONGO_TABLE_NAME]