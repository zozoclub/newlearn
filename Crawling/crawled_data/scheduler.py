import sys
import pytz
from apscheduler.schedulers.background import BackgroundScheduler
from django_apscheduler.jobstores import DjangoJobStore
import logging
import subprocess

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

logger.info("Initializing the scheduler...")

scheduler = BackgroundScheduler(timezone=pytz.timezone('Asia/Seoul'))
scheduler.add_jobstore(DjangoJobStore(), "default")

scheduler.add_job(my_scheduled_job, 'cron', hour=17, minute=30, second=10, replace_existing=True)
scheduler.add_job(my_scheduled_job, 'cron', hour=23, minute=15, second=30, replace_existing=True)

logger.info("Scheduler initialized successfully.")
