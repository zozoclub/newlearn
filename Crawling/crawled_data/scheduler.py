import os
import django

# Django 설정 모듈 설정
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Crawling.settings')
django.setup()

import sys
import pytz
import logging
import subprocess
from apscheduler.schedulers.background import BackgroundScheduler
from django_apscheduler.jobstores import DjangoJobStore
from apscheduler.events import JobExecutionEvent, SchedulerEvent

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 작업을 정의하는 함수
def my_scheduled_job():
    try:
        # 환경 변수 확인 (로그로 출력)
        gen_ai_secret_key = os.getenv('GEN_AI_SECRET_KEY')
        crawling_user_agent = os.getenv('CRAWLING_USER_AGENT')
        open_ai_api_key = os.getenv('OPEN_AI_API_KEY')
        logger.info(f"GEN_AI_SECRET_KEY: {gen_ai_secret_key}")
        logger.info(f"CRAWLING_USER_AGENT: {crawling_user_agent}")
        logger.info(f"OPEN_AI_API_KEY: {open_ai_api_key}")

        # 실제 작업 실행
        result = subprocess.run(
            [sys.executable, 'manage.py', 'main'],
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        logger.info(f"Scheduled job executed successfully: {result.stdout.decode('utf-8')}")
    except subprocess.CalledProcessError as e:
        logger.error(f"Error occurred during scheduled job: {e.stderr.decode('utf-8')}")
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")

# 스케줄러 초기화
logger.info("Initializing the scheduler...")
scheduler = BackgroundScheduler(timezone=pytz.timezone('Asia/Seoul'))
scheduler.add_jobstore(DjangoJobStore(), "default")

# 스케줄러에 작업 추가 (고유한 ID 사용)
scheduler.add_job(
    my_scheduled_job,
    'cron',
    hour=17,
    id='daily_job_1730',
    replace_existing=True
)
scheduler.add_job(
    my_scheduled_job,
    'cron',
    hour=23,
    minute=15,
    second=30,
    id='daily_job_2315',
    replace_existing=True
)

# 리스너 설정
def my_listener(event):
    if isinstance(event, JobExecutionEvent):
        if event.exception:
            logger.error(f"The job crashed :( {event.job_id}")
        else:
            logger.info(f"The job worked :) {event.job_id}")
    elif isinstance(event, SchedulerEvent):
        # SchedulerEvent에 대한 추가적인 처리가 필요하면 여기에 작성
        pass

scheduler.add_listener(my_listener)

logger.info("Scheduler initialized successfully.")

# 스케줄러 시작
scheduler.start()
logger.info("Scheduler started!")

# 스케줄러를 강제로 종료하지 않도록 대기
try:
    while True:
        pass
except (KeyboardInterrupt, SystemExit):
    # 스케줄러 종료
    scheduler.shutdown()
    logger.info("Scheduler shut down!")
