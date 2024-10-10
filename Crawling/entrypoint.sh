#!/bin/bash
set -e

echo "Starting entrypoint.sh"

# .env 파일을 source로 로드하여 환경 변수로 설정
if [ -f /app/.env ]; then
    echo "Loading environment variables from .env"
    set -o allexport
    source /app/.env
    set +o allexport
else
    echo ".env file not found"
fi

# 데이터베이스 마이그레이션 실행
echo "Running database migrations..."
python manage.py migrate

echo "Starting the scheduler..."
# 스케줄러 시작
exec "$@"
