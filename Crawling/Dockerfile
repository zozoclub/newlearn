# Python 3.12.6 slim 이미지 사용
FROM python:3.12.6-slim

# 작업 디렉토리 설정
WORKDIR /app

# 필요한 패키지 설치를 위한 APT 패키지 업데이트 및 필수 패키지 설치
RUN apt-get update && apt-get install -y \
    gcc \
    python3-dev \
    cron \
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

# 스크립트 복사 및 실행 권한 부여
COPY run_crawler.sh /app/run_crawler.sh
COPY start.sh /app/start.sh
RUN chmod +x /app/run_crawler.sh /app/start.sh

# 크론 작업 설정
## 크론 작업의 출력 : /var/log/cron.log 파일에 기록됨
# RUN echo "0 11,23 * * * /app/run_crawler.sh >> /var/log/cron.log 2>&1" > /etc/cron.d/crawler-cron # 11시, 23시
RUN echo "0 2,8 * * * root /app/run_crawler.sh >> /var/log/cron.log 2>&1" > /etc/cron.d/crawler-cron


# 크론 작업 파일에 대한 권한 설정
RUN chmod 0644 /etc/cron.d/crawler-cron

# 개행 추가
RUN echo "" >> /etc/cron.d/crawler-cron
# 크론 작업 등록
RUN crontab /etc/cron.d/crawler-cron

# 한국 시간대 설정
RUN ln -sf /usr/share/zoneinfo/Asia/Seoul /etc/localtime

# 시작 스크립트 실행
CMD ["/app/start.sh"]