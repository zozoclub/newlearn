#!/bin/bash

# 환경 변수 로드 (필요한 경우)
source /app/.env

# 현재 시간 로그
echo "[시작] crawler at $(date)" >> /var/log/crawler.log

# 크롤러 실행
python /app/manage.py main
# 크롤러 실행 결과 /var/log/results에 저장 시,
# python /app/manage.py main --output /var/log/results 

# 완료 시간 로그
echo "Crawler finished at $(date)" >> /var/log/crawler.log