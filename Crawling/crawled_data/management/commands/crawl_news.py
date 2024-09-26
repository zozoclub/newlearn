import re
import pandas as pd
from bs4 import BeautifulSoup
from datetime import datetime
from django.core.management.base import BaseCommand
import requests
from Crawling import settings
import logging
import os

CRAWLING_USER_AGENT = settings.CRAWLING_USER_AGENT

class Command(BaseCommand):
    help = "특정 카테고리(sid)에 대해 뉴스 크롤링 후 CSV 파일로 저장합니다."

    def add_arguments(self, parser):
        # sid와 output 인자 추가
        parser.add_argument('sid', type=int, help="뉴스 카테고리 ID")
        parser.add_argument('--output', type=str, help="출력 파일 경로", required=True)

    def handle(self, *args, **kwargs):
        sid = kwargs['sid']
        output = kwargs['output']  # output 인자 받기

        def clean_text(text):
            text = text.replace('\n', ' ').strip()
            text = re.sub(r'\s+', ' ', text)
            text = re.sub(r'\s*[\.\?!]\s*', '. ', text)
            return text

        def ex_tag(sid, page):
            url = f"https://news.naver.com/main/main.naver?mode=LSD&mid=shm&sid1={sid}&page={page}"
            headers = {"User-Agent": CRAWLING_USER_AGENT}
            try:
                html = requests.get(url, headers=headers)
                html.raise_for_status()
                soup = BeautifulSoup(html.text, "lxml")
                a_tags = soup.find_all("a")
                tag_list = [a["href"] for a in a_tags if "href" in a.attrs and "article" in a["href"] and "comment" not in a["href"]]
                return tag_list
            except requests.RequestException as e:
                logging.error(f"Request error: {e}")
                return []

        def re_tag(sid, num_pages=1):
            re_lst = []
            for i in range(num_pages):
                lst = ex_tag(sid, i + 1)
                if lst:
                    re_lst.extend(lst)
                else:
                    logging.warning(f"No links found for SID: {sid}, Page: {i+1}")
            return list(set(re_lst))

        def art_crawl(url):
            art_dic = {}
            headers = {"User-Agent": CRAWLING_USER_AGENT}
            selectors = {
                "title": "#title_area > span",
                "published_date": "#ct > div.media_end_head.go_trans > div.media_end_head_info.nv_notrans > div.media_end_head_info_datestamp > div:nth-child(1) > span",
                "content": "#dic_area",
                "press": ".media_end_head_top_logo img",
                "journalist": ".media_end_head_journalist_name",
                "thumbnail_image_url": "#img1"
            }

            try:
                html = requests.get(url, headers=headers)
                html.raise_for_status()
                soup = BeautifulSoup(html.text, "lxml")

                main_content = soup.select_one(selectors["content"])
                if not main_content:
                    logging.warning(f"No main content found for URL: {url}")
                    return None

                art_dic = {key: clean_text(soup.select_one(selector).text) if soup.select_one(selector) else ""
                           for key, selector in selectors.items()}

                press = soup.select_one(selectors["press"])
                art_dic["press"] = press['alt'].strip() if press else ""
                image = soup.select_one(selectors["thumbnail_image_url"])
                art_dic["thumbnail_image_url"] = image['data-src'] if image else ""

                return art_dic
            except requests.RequestException as e:
                logging.error(f"Request error while crawling article: {e}")
                return None

        # 날짜에 따라 폴더 및 파일명 생성
        current_date = datetime.now().strftime("%y%m%d")
        base_folder = os.path.join("crawl_data", current_date)
        if not os.path.exists(base_folder):
            os.makedirs(base_folder)

        sid_to_section = {
            100: 1,
            101: 2,
            102: 3,
            103: 4,
            104: 5,
            105: 6
        }
        section = sid_to_section.get(sid, sid)

        # 크롤링할 링크 수집
        hrefs = re_tag(sid, num_pages=1)
        artdic_list = []
        for url in hrefs:
            art_dic = art_crawl(url)
            if art_dic and art_dic.get("content"):
                art_dic["section"] = section
                art_dic["url"] = url
                artdic_list.append(art_dic)

        if artdic_list:
            art_df = pd.DataFrame(artdic_list)
            crawl_file_path = output
            art_df.to_csv(crawl_file_path, index=False)
            self.stdout.write(self.style.SUCCESS(f'크롤링 및 CSV 저장 완료! 파일명: {crawl_file_path}'))
        else:
            self.stdout.write(self.style.WARNING(f'수집된 데이터가 없습니다 for SID: {sid}.'))

