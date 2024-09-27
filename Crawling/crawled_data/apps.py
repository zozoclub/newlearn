from django.apps import AppConfig
import logging
import os

logger = logging.getLogger(__name__)

class CrawledDataConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'crawled_data'

    def ready(self):
        if os.environ.get('RUN_MAIN') == 'true':  # 개발 서버의 메인 프로세스에서만 실행
            from .scheduler import scheduler

            if not scheduler.running:
                logger.info("Starting the scheduler...")
                scheduler.start()
            else:
                logger.info("Scheduler is already running.")
