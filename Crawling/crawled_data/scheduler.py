import os
import sys
import django
import pytz
from apscheduler.schedulers.background import BackgroundScheduler
from django_apscheduler.jobstores import DjangoJobStore
import logging
import subprocess
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

load_dotenv(dotenv_path=os.path.join(BASE_DIR, '.env'))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Crawling.settings')
django.setup()

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(name)s: %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)

logger = logging.getLogger(__name__)

def my_scheduled_job():
    try:
        result = subprocess.run(
            [sys.executable, 'manage.py', 'main'],
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        logger.info(f"Scheduled job executed successfully: {result.stdout.decode('utf-8')}")
    except subprocess.CalledProcessError as e:
        logger.error(f"Error occurred during scheduled job: {e.stderr.decode('utf-8')}")

if __name__ == '__main__':
    logger.info("Initializing the scheduler...")

    scheduler = BackgroundScheduler(timezone=pytz.timezone('Asia/Seoul'))
    scheduler.add_jobstore(DjangoJobStore(), "default")

    # 작업 스케줄 설정 (필요에 따라 시간 조정)
    scheduler.add_job(my_scheduled_job, 'cron', hour=17, minute=30, second=10, replace_existing=True)
    scheduler.add_job(my_scheduled_job, 'cron', hour=23, minute=15, second=30, replace_existing=True)

    scheduler.start()
    logger.info("Scheduler initialized successfully.")

    # 스크립트가 종료되지 않도록 유지
    try:
        import time
        while True:
            time.sleep(1)
    except (KeyboardInterrupt, SystemExit):
        scheduler.shutdown()
        logger.info("Scheduler shut down successfully!")
