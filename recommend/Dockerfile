# 기본 이미지로 Python 3.12를 사용합니다.
FROM python:3.12.3-slim

# 로케일 설정을 위한 패키지 설치
RUN apt-get update && apt-get install -y locales

# 한국어 로케일 생성
RUN localedef -i ko_KR -c -f UTF-8 -A /usr/share/locale/locale.alias ko_KR.UTF-8

# 환경 변수 설정
ENV LANG ko_KR.UTF-8
ENV LC_ALL ko_KR.UTF-8

# 작업 디렉토리를 설정합니다.
WORKDIR .

# 애플리케이션 코드를 복사합니다.
COPY . .

# 시스템 패키지 업데이트 및 의존성 설치
RUN apt-get update && \
    pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

EXPOSE 8003

# FastAPI 애플리케이션을 실행합니다.
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8003"]
