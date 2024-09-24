# Python 3.12.6 slim 이미지 사용
FROM python:3.12.6-slim

# 작업 디렉토리 설정
WORKDIR /app

# 필요한 패키지 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# .env 파일 복사
COPY .env /app/.env

# 소스 코드 복사
COPY . .

# 환경 변수 설정을 위한 패키지 설치
RUN pip install python-dotenv

# static 파일 모으기
RUN python manage.py collectstatic --noinput

# 환경 변수 로드 및 서버 실행 명령
CMD ["sh", "-c", "export $(cat .env | xargs) && python manage.py main 0.0.0.0:8000"]

