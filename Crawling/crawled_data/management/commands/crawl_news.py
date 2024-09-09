from django.core.management.base import BaseCommand
import requests
from bs4 import BeautifulSoup
from tqdm import tqdm
import pandas as pd

user_agent = ""

class Command(BaseCommand):
    help = "뉴스를 크롤링하여 CSV 파일로 저장합니다."

    def handle(self, *args, **kwargs):
        def ex_tag(sid, page):
            # 뉴스 링크를 추출하는 함수
            url = f"https://news.naver.com/main/main.naver?mode=LSD&mid=shm&sid1={sid}" \
                  "#&date=20240904:00&page={page}"

            headers = {"User-Agent": user_agent}
            html = requests.get(url, headers=headers)
            soup = BeautifulSoup(html.text, "lxml")
            a_tag = soup.find_all("a")

            tag_list = []
            for a in a_tag:
                if "href" in a.attrs:
                    href = a["href"]
                    if "article" in href and "comment" not in href:
                        tag_list.append(href)
            return tag_list

        def re_tag(sid):
            # 특정 분야의 뉴스 링크를 모아서 중복 제거
            re_lst = []
            for i in tqdm(range(1)):  # 1 페이지만 수집
                lst = ex_tag(sid, i + 1)
                re_lst.extend(lst)
            return list(set(re_lst))

        def art_crawl(all_hrefs, sid, index):
            # 기사 본문 크롤링
            art_dic = {}
            headers = {"User-Agent": user_agent}

            title_selector = "#title_area > span"
            date_selector = "#ct > div.media_end_head.go_trans > div.media_end_head_info.nv_notrans > div.media_end_head_info_datestamp > div:nth-child(1) > span"
            main_selector = "#dic_area"
            press_selector = ".media_end_head_top_logo img"
            journalist_selector = ".media_end_head_journalist_name"
            image_selector = "#img1"

            url = all_hrefs[sid][index]
            html = requests.get(url, headers=headers)
            soup = BeautifulSoup(html.text, "lxml")

            title = soup.select_one(title_selector)
            title_str = title.text.replace('\n', ' ').strip() if title else ""

            date = soup.select_one(date_selector)
            date_str = date.text.replace('\n', ' ').strip() if date else ""

            main = soup.select_one(main_selector)
            main_str = main.text.replace('\n', ' ').strip() if main else ""

            press = soup.select_one(press_selector)
            press_str = press['alt'].strip() if press else ""

            journalist = soup.select_one(journalist_selector)
            journalist_str = journalist.text.replace('\n', ' ').strip() if journalist else ""

            image = soup.select_one(image_selector)
            image_url = image['data-src'] if image else ""

            art_dic.update({
                "title": title_str,
                "date": date_str,
                "main": main_str,
                "press": press_str,
                "journalist": journalist_str,
                "image": image_url
            })
            return art_dic

        # 뉴스 크롤링 수행
        all_hrefs = {}
        sids = [102]  # 예시로 하나의 분야만 크롤링
        for sid in sids:
            sid_data = re_tag(sid)
            all_hrefs[sid] = sid_data

        artdic_list = []
        for sid, hrefs in all_hrefs.items():
            for i in range(len(hrefs)):
                art_dic = art_crawl(all_hrefs, sid, i)
                art_dic["section"] = sid
                art_dic["url"] = hrefs[i]
                artdic_list.append(art_dic)

        art_df = pd.DataFrame(artdic_list)
        art_df.to_csv("article_df.csv", index=False)  # CSV 파일로 저장
        self.stdout.write(self.style.SUCCESS('크롤링 및 CSV 저장 완료!'))
