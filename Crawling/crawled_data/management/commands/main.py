from datetime import datetime

from django.core.management import call_command
from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help = "뉴스 크롤링과 번역 작업을 연속으로 실행합니다."

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.NOTICE('크롤링 작업을 시작합니다...'))

        current_date = datetime.now().strftime("%Y%m%d")  # Dynamically generate today's date for filename
        filename = f"{current_date}.csv"
        try:
            # 크롤링 작업 실행
            call_command('crawl_news')
            self.stdout.write(self.style.SUCCESS('크롤링 작업 완료!'))

            # 번역 작업 실행
            self.stdout.write(self.style.NOTICE('번역 작업을 시작합니다...'))
            call_command('translate_news')
            self.stdout.write(self.style.SUCCESS('번역 작업 완료!'))

            # 체크작업 중복 그리고 몽고 저장
            self.stdout.write(self.style.NOTICE('중복 검사 및 MongoDB 저장을 시작합니다...'))
            call_command('check_translated_news')
            self.stdout.write(self.style.SUCCESS('중복 검사 및 MongoDB 저장 완료!'))


        except Exception as e:
            self.stdout.write(self.style.ERROR(f'작업 중 오류 발생: {e}'))
