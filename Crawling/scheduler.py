from datetime import timezone

from apscheduler.schedulers.background import BackgroundScheduler
from django_apscheduler.jobstores import DjangoJobStore
import logging
import subprocess

logger = logging.getLogger(__name__)

def my_scheduled_job():
    try:
        result = subprocess.run(['python', 'manage.py', 'main'], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        logger.info(f"Scheduled job executed successfully: {result.stdout}")
    except subprocess.CalledProcessError as e:
        logger.error(f"Error occurred during scheduled job: {e.stderr}")

def start():
    scheduler = BackgroundScheduler(timezone=timezone('Asia/Seoul'))
    scheduler.add_jobstore(DjangoJobStore(), "default")

    # 오후 2시 작업
    scheduler.add_job(
        my_scheduled_job,
        'cron',
        hour=14,
        minute=11,
        id='my_job_2pm',
        replace_existing=True
    )

    # 오후 9시 작업
    scheduler.add_job(
        my_scheduled_job,
        'cron',
        hour=21,
        minute=0,
        id='my_job_9pm',
        replace_existing=True
    )

    scheduler.start()
