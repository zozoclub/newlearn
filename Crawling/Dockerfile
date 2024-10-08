# Python 3.12.6 slim 이미지 사용
FROM python:3.12.6-slim

# 작업 디렉토리 설정
WORKDIR /app

# 필요한 패키지 설치를 위한 APT 패키지 업데이트 및 필수 패키지 설치
RUN apt-get update && apt-get install -y \
    gcc \
    python3-dev \
    libpq-dev \
    dos2unix \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# 필요한 패키지 설치
COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# 소스 코드 및 .env 파일 복사
COPY . .

# Python 경로 설정 (Crawling 모듈을 찾을 수 있도록)
ENV PYTHONPATH=/app:$PYTHONPATH

# Django 환경 변수 설정
ENV DJANGO_SETTINGS_MODULE=Crawling.settings
ENV ENV_FILE=/app/.env

# entrypoint.sh 복사 및 실행 권한 부여
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# .env 파일의 줄바꿈 형식을 UNIX 스타일로 변환
RUN dos2unix /app/.env

# entrypoint 설정
ENTRYPOINT ["/entrypoint.sh"]

# 스케줄러 스크립트 실행
CMD ["python", "crawled_data/scheduler.py"]
