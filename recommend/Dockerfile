# 기본 이미지로 Python 3.12을 사용합니다.
FROM python:3.12.3-slim

# 작업 디렉토리를 설정합니다.
WORKDIR /app

# requirements.txt 파일을 컨테이너에 복사
COPY requirements.txt .

# 의존성을 설치합니다.
RUN apt-get update
RUN pip install --no-cache-dir -r requirements.txt

# 의존성 목록을 복사합니다.
COPY . .

# FastAPI 애플리케이션을 실행합니다.
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
