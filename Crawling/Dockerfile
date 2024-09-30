# Python 3.12.6 slim 이미지 사용
FROM python:3.12.6-slim

# 작업 디렉토리 설정
WORKDIR /app

# 필요한 패키지 설치를 위한 APT 패키지 업데이트 및 필수 패키지 설치
RUN apt-get update && apt-get install -y \
    gcc \
    python3-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# setuptools 설치 (distutils를 포함)
RUN pip install --no-cache-dir setuptools

# 필요한 패키지 설치
COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# .env 파일 복사
COPY .env /app/.env

# 소스 코드 복사
COPY . .

# 환경 변수 설정을 위한 패키지 설치
RUN pip install python-dotenv

# 환경 변수 로드 및 서버 실행 명령
CMD ["python", "manage.py", "main"]

