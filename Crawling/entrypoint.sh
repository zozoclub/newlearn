#!/bin/bash
set -e

# .env 파일을 source로 로드하여 환경 변수로 설정
if [ -f /app/.env ]; then
    set -o allexport
    source /app/.env
    set +o allexport
fi

# 데이터베이스 마이그레이션 실행
python manage.py migrate

# 스케줄러 시작
exec "$@"
