import re
import pandas as pd
from bs4 import BeautifulSoup
from datetime import datetime
from django.core.management.base import BaseCommand
import requests
from Crawling import settings
from tqdm import tqdm
import logging

CRAWLING_USER_AGENT = settings.CRAWLING_USER_AGENT

class Command(BaseCommand):
    help = "뉴스를 크롤링하여 CSV 파일로 저장합니다."

    def handle(self, *args, **kwargs):
        def clean_text(text):
            # Remove unwanted whitespace and special characters
            text = text.replace('\n', ' ').strip()
            text = re.sub(r'\s+', ' ', text)  # Replace multiple spaces with a single space
            text = re.sub(r'\s*[\.\?!]\s*', '. ', text)  # Ensure proper spacing after punctuation
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
            for i in tqdm(range(num_pages), desc=f"Collecting links for sid={sid}"):
                lst = ex_tag(sid, i + 1)
                re_lst.extend(lst)
            return list(set(re_lst))

        def art_crawl(url):
            art_dic = {}
            headers = {"User-Agent": CRAWLING_USER_AGENT}
            selectors = {
                "title": "#title_area > span",
                "date": "#ct > div.media_end_head.go_trans > div.media_end_head_info.nv_notrans > div.media_end_head_info_datestamp > div:nth-child(1) > span",
                "main": "#dic_area",
                "press": ".media_end_head_top_logo img",
                "journalist": ".media_end_head_journalist_name",
                "image": "#img1"
            }

            try:
                html = requests.get(url, headers=headers)
                html.raise_for_status()
                soup = BeautifulSoup(html.text, "lxml")

                # Only proceed if the main content exists
                main_content = soup.select_one(selectors["main"])
                if not main_content:
                    return None  # If main content is None, return None

                art_dic = {key: clean_text(soup.select_one(selector).text) if soup.select_one(selector) else ""
                           for key, selector in selectors.items()}

                # Special handling for press and image
                press = soup.select_one(selectors["press"])
                art_dic["press"] = press['alt'].strip() if press else ""
                image = soup.select_one(selectors["image"])
                art_dic["image"] = image['data-src'] if image else ""

                return art_dic
            except requests.RequestException as e:
                logging.error(f"Request error while crawling article: {e}")
                return None

        all_hrefs = {}
        sids = [100, 101, 102, 103, 104, 105]  # sid 100~105로 설정
        for sid in sids:
            all_hrefs[sid] = re_tag(sid, num_pages=3)  # 예를 들어 3페이지까지 크롤링

        artdic_list = []
        for sid, hrefs in all_hrefs.items():
            for url in hrefs:
                art_dic = art_crawl(url)
                if art_dic and art_dic.get("main"):  # Check if the main content exists before adding
                    art_dic["section"] = sid
                    art_dic["url"] = url
                    artdic_list.append(art_dic)

        if artdic_list:  # If there is any data to save
            art_df = pd.DataFrame(artdic_list)

            # 현재 날짜를 기준으로 파일명 생성
            current_date = datetime.now().strftime("%Y%m%d")  # YYYYMMDD 형식
            filename = f"{current_date}.csv"

            # CSV 파일로 저장
            art_df.to_csv(filename, index=False)
            self.stdout.write(self.style.SUCCESS(f'크롤링 및 CSV 저장 완료! 파일명: {filename}'))
        else:
            self.stdout.write(self.style.WARNING('수집된 데이터가 없습니다.'))
