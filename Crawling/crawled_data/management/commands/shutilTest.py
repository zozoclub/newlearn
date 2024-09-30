import os
import shutil
from datetime import datetime

from django.core.management.base import BaseCommand



class Command(BaseCommand):
    help = '몽고 db랑 redis에 중복되어있는지 확인하는 코드'

    def handle(self, *args, **options):

        current_date = datetime.now().strftime("%y%m%d")
        base_folder = os.path.join("crawl_data", "220924")

        shutil.rmtree(base_folder, ignore_errors=True)
