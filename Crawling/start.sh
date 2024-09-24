#!/bin/bash

# cron 서비스 시작
service cron start

# 크론 작업이 제대로 등록되었는지 확인
crontab -l

echo "Cron service started. Crawler will run at scheduled times."
echo "Tailing cron log. Press Ctrl+C to stop the container."

# cron 로그 파일이 없으면 생성
touch /var/log/cron.log

# cron 로그 실시간 출력
tail -f /var/log/cron.log
