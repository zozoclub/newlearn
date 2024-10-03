from app.database import user_news_click
from app.models import UserCategory, News, User, UserNewsScrap
from sqlalchemy.orm import Session
import numpy as np
from typing import Dict, List
from collections import defaultdict
from datetime import datetime, timedelta

##################################### 데이터 처리

# 해당 유저의 user_news_click (MongoDB) 가져 오기
def get_user_click_log(user_id: int):
    return list(user_news_click.find({"user_id": user_id}))

# 코사인 유사도 계산
def cosine_similarity(vec1, vec2):
    dot_product = np.dot(vec1, vec2)
    norm_a = np.linalg.norm(vec1)
    norm_b = np.linalg.norm(vec2)
    return dot_product / (norm_a * norm_b) if norm_a and norm_b else 0.0

# 다른 유저와 유사한 클릭 패턴 찾기
def find_similar_users(user_id: int):
    user_clicks = get_user_click_log(user_id)
    user_news_set = {click["news_id"] for click in user_clicks}

    # 다른 유저 클릭 로그 수집
    all_users_clicks = user_news_click.find({"user_id": {"$ne": user_id}})

    user_vector_map = {}
    for other_user_clicks in all_users_clicks:
        other_user_id = other_user_clicks["user_id"]

        # 클릭 로그를 리스트로 변환하여 news_id 수집
        other_user_news_set = {click["news_id"] for click in list(user_news_click.find({"user_id": other_user_id}))}

        # 공통 클릭 수 벡터화
        all_news_ids = user_news_click.distinct("news_id")
        vec1 = [1 if news_id in user_news_set else 0 for news_id in all_news_ids]
        vec2 = [1 if news_id in other_user_news_set else 0 for news_id in all_news_ids]

        # 코사인 유사도 계산
        similarity = cosine_similarity(vec1, vec2)
        if similarity > 0:  # 유사도가 0보다 큰 경우만 추가
            user_vector_map[other_user_id] = similarity

    # 유사도 높은 순으로 정렬
    similar_users = sorted(user_vector_map.items(), key=lambda x: x[1], reverse=True)
    return [user[0] for user in similar_users]

# 해당 유저의 UserCategory (MySQL) 가져 오기
def get_user_categories(user_id: int, db: Session):
    return db.query(UserCategory).filter(UserCategory.user_id == user_id).all()

# ## published_date가 문자열값이므로 적절히 고침
# # (한글 로케일 설정)
# locale.setlocale(locale.LC_TIME, 'ko_KR.UTF-8')
# # (published_date (Varchar(100))을 datetime 객체로 변환)
# def parse_published_date(date_str: str) -> datetime:
#     return datetime.strptime(date_str, '%Y. %m. %d. %p %I:%M')
# # News (MySQL) 가져 오기
# def get_news_metadata(news_id: int, db: Session):
#     news = db.query(News).filter(News.news_id == news_id).first()
#     if news and isinstance(news.published_date, str):
#         news.published_date = parse_published_date(news.published_date)
#     return news

# News (MySQL) 가져 오기
def get_news_metadata(news_id: int, db: Session):
    return db.query(News).filter(News.news_id == news_id).first()

# User (MySQL) 가져 오기
def get_user_difficulty(user_id: int, db: Session):
    user = db.query(User).filter(User.user_id == user_id).first()
    if user:
        return user.difficulty
    return None

# 시간대별 뉴스 인기도 계산하기
def get_time_based_popularity(db: Session) -> Dict[int, Dict[str, int]]:
    current_time = datetime.now()
    one_day_ago = current_time - timedelta(days=1)

    time_based_popularity = defaultdict(lambda: {'아침': 0, '오후': 0, '저녁': 0, '밤': 0})

    reads = db.query(UserNewsScrap).filter(UserNewsScrap.scraped_date >= one_day_ago).all()

    for read in reads:
        hour = read.scraped_date.hour
        if 6 <= hour < 12:
            time_period = '아침'
        elif 12 <= hour < 18:
            time_period = '오후'
        elif 18 <= hour < 24:
            time_period = '저녁'
        else:
            time_period = '밤'

        time_based_popularity[read.news_id][time_period] += 1

    return dict(time_based_popularity)

# 난이도별 뉴스 인기도(스크랩 수) 계산하기
def get_difficulty_based_popularity(db: Session) -> Dict[int, Dict[int, int]]:
    difficulty_popularity = defaultdict(lambda: {1: 0, 2: 0, 3: 0})

    scraps = db.query(UserNewsScrap).all()

    for scrap in scraps:
        difficulty_popularity[scrap.news_id][scrap.difficulty] += 1

    return dict(difficulty_popularity)

# 사용자의 시간대별 뉴스 읽기 패턴 분석
def get_user_time_pattern(user_id: int, db: Session) -> Dict[str, float]:
    one_week_ago = datetime.now() - timedelta(days=7)
    user_scraps = db.query(UserNewsScrap).filter(
        UserNewsScrap.user_id == user_id,
        UserNewsScrap.scraped_date >= one_week_ago
    ).all()

    time_pattern = {'아침': 0, '오후': 0, '저녁': 0, '밤': 0}
    total_scraps = len(user_scraps)

    for scrap in user_scraps:
        hour = scrap.scraped_date.hour
        if 6 <= hour < 12:
            time_pattern['아침'] += 1
        elif 12 <= hour < 18:
            time_pattern['오후'] += 1
        elif 18 <= hour < 24:
            time_pattern['저녁'] += 1
        else:
            time_pattern['밤'] += 1

    if total_scraps > 0:
        for key in time_pattern:
            time_pattern[key] /= total_scraps

    return time_pattern

##################################### 협업 필터링 로직

def get_cf_news(user_id: int, db: Session):
    similar_users = find_similar_users(user_id)

    # 유저 관심 카테고리 기반 가중치 추가
    user_categories = get_user_categories(user_id, db)
    user_category_ids = [uc.category_id for uc in user_categories]

    # 유사한 유저가 클릭한 뉴스 가져 오기
    recommended_news = {}
    # current_time = datetime.now()

    for similar_user_id in similar_users:
        similar_user_clicks = get_user_click_log(similar_user_id)
        for click in similar_user_clicks:
            if not user_news_click.find_one({"user_id": user_id, "news_id": click["news_id"]}):
                news_metadata = get_news_metadata(click["news_id"], db)

                # 가중치 계산
                weight = 0

                # 1) 카테고리(관심도)에 따른 가중치
                if news_metadata.category_id in user_category_ids:
                    weight += 2  # 가중치 2 (관심 카테고리)
                else:
                    weight += 1  # 가중치 1 (비관심 카테고리)

                # 2) 조회수에 따른 가중치
                weight += news_metadata.hit / 10  # ex) 조회수를 10으로 나누어 가중치 부여 (가중치가 너무 커질까봐)

                # # 3) 작성 시간(최신)에 따른 가중치
                # time_diff = (current_time - news_metadata.published_date).total_seconds() / 3600  # 시간 차이를 시간 단위로 변환
                # if time_diff < 24:  # 24시간 이내의 뉴스에 추가 가중치
                #     weight += 1  # 최신 뉴스에 가중치 1 추가

                # 가중치에 따른 추천 뉴스 수집
                recommended_news[click["news_id"]] = recommended_news.get(click["news_id"], 0) + weight

    # 가중치 기준으로 추천 뉴스 정렬
    return sorted(recommended_news.items(), key=lambda x: x[1], reverse=True)[:5]


##################################### 콘텐츠 기반 필터링 로직

def get_cbf_news(user_id: int, db: Session):
    user_categories = get_user_categories(user_id, db)
    user_category_ids = [uc.category_id for uc in user_categories]
    user_clicks = get_user_click_log(user_id)
    user_difficulty = get_user_difficulty(user_id, db)
    user_time_pattern = get_user_time_pattern(user_id, db)

    time_based_popularity = get_time_based_popularity(db)
    difficulty_based_popularity = get_difficulty_based_popularity(db)

    recommended_news = {}

    all_news = db.query(News).all()
    for news in all_news:
        if news.news_id not in [click["news_id"] for click in user_clicks]:
            weight = 0

            # 1) 카테고리(관심도)에 따른 가중치
            if news.category_id in user_category_ids:
                weight += 2
            else:
                weight += 1

            # 2) 조회수에 따른 가중치
            weight += news.hit / 100

            # 3) 시간대별 인기도에 따른 가중치
            news_time_popularity = time_based_popularity.get(news.news_id, {})
            for time_period, popularity in news_time_popularity.items():
                weight += popularity * user_time_pattern.get(time_period, 0) / 10

            # 4) 난이도 스크랩 수에 따른 가중치
            news_difficulty_popularity = difficulty_based_popularity.get(news.news_id, {})
            weight += news_difficulty_popularity.get(user_difficulty, 0) / 5

            recommended_news[news.news_id] = weight

    sorted_news_ids = sorted(recommended_news, key=recommended_news.get, reverse=True)
    return [get_news_metadata(news_id, db) for news_id in sorted_news_ids[:20]]  # 상위 20개 추천


def hybrid_recommendation(user_id: int, db: Session, num_recommendations: int = 10) -> List[News]:
    cf_recommendations = get_cf_news(user_id, db)
    cbf_recommendations = get_cbf_news(user_id, db)

    hybrid_scores = defaultdict(float)

    for news_id, score in cf_recommendations:
        hybrid_scores[news_id] += score

    for news in cbf_recommendations:
        hybrid_scores[news.news_id] += 1

    final_recommendations = sorted(hybrid_scores.items(), key=lambda x: x[1], reverse=True)

    recommended_news_ids = [news_id for news_id, _ in final_recommendations[:num_recommendations]]
    return [get_news_metadata(news_id, db) for news_id in recommended_news_ids]
