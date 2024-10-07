# Python 3.12.6 slim 이미지 사용
FROM python:3.12.6-slim

# 작업 디렉토리 설정
WORKDIR /app

# 필요한 패키지 설치를 위한 APT 패키지 업데이트 및 필수 패키지 설치
RUN apt-get update && apt-get install -y \
    gcc \
    python3-dev \
    libpq-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# 필요한 패키지 설치
COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# 소스 코드 및 .env 파일 복사
COPY . .
COPY .env .env

# Django 환경 변수 설정
ENV DJANGO_SETTINGS_MODULE=Crawling.settings

# 컨테이너 시작 시 실행할 명령어를 scheduler.py로 변경
CMD ["python", "scheduler.py"]
