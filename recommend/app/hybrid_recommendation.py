from app.database import user_news_click
from app.models import UserCategory, News, User, UserNewsScrap
from sqlalchemy.orm import Session
import numpy as np
from typing import Dict, List, Tuple
from collections import defaultdict
from datetime import datetime, timedelta
import locale
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from functools import lru_cache

# 한글 로케일 설정
locale.setlocale(locale.LC_TIME, 'ko_KR.UTF-8')

#####################################
# 1. 사용자 데이터 가져오기
#####################################
@lru_cache(maxsize=1024)
def get_user_categories(user_id: int, db: Session):
    """해당 유저의 UserCategory (MySQL) 가져오기"""
    return db.query(UserCategory).filter(UserCategory.user_id == user_id).all()

@lru_cache(maxsize=1024)
def get_user_difficulty(user_id: int, db: Session):
    """User (MySQL) 가져오기"""
    user = db.query(User).filter(User.user_id == user_id).first()
    return user.difficulty if user else None

def get_user_click_log(user_id: int, limit: int = 100):
    """해당 유저의 user_news_click (MongoDB) 가져오기 (부분적 로딩)"""
    return list(user_news_click.find({"user_id": user_id}).limit(limit))

#####################################
# 2. 데이터 전처리 및 유사도 계산
#####################################
@lru_cache(maxsize=1)
def vectorize_titles(titles_tuple: Tuple[str, ...]) -> Tuple[np.ndarray, TfidfVectorizer]:
    """뉴스 제목을 벡터화하고 TF-IDF 벡터라이저 반환"""
    vectorizer = TfidfVectorizer()
    return vectorizer.fit_transform(titles_tuple).toarray(), vectorizer

#####################################
# 3. 유사한 유저 찾기
#####################################
def find_similar_users(user_id: int, db: Session, limit: int = 100):
    """코사인 유사도를 사용하여 유사한 사용자 찾기 (부분적 로딩)"""
    user_clicks = get_user_click_log(user_id, limit)
    user_news_set = {click["news_id"] for click in user_clicks}

    all_users_clicks = {
        user_click["user_id"]: get_user_click_log(user_click["user_id"], limit)
        for user_click in user_news_click.find({"user_id": {"$ne": user_id}}).limit(limit)
    }

    all_news_ids = user_news_click.distinct("news_id")
    user_vector_map = {}

    user_vector = np.array([1 if news_id in user_news_set else 0 for news_id in all_news_ids])

    for other_user_id, other_user_clicks in all_users_clicks.items():
        other_user_news_set = {click["news_id"] for click in other_user_clicks}
        other_user_vector = np.array([1 if news_id in other_user_news_set else 0 for news_id in all_news_ids])

        similarity = cosine_similarity([user_vector], [other_user_vector])[0][0]
        if similarity > 0:
            user_vector_map[other_user_id] = similarity

    similar_users = sorted(user_vector_map.items(), key=lambda x: x[1], reverse=True)
    return [user[0] for user in similar_users]

#####################################
# 4. 뉴스 메타 데이터 및 날짜 파싱
#####################################
def parse_korean_date(date_str: str) -> datetime:
    """한국어 날짜 문자열을 파싱하여 datetime 객체로 변환"""
    try:
        date_parts = date_str.split()
        if len(date_parts) != 5:
            raise ValueError("Invalid date format")
        date = ' '.join(date_parts[:3])
        am_pm = date_parts[3]
        time = date_parts[4]

        date_obj = datetime.strptime(date, '%Y. %m. %d.')
        hour, minute = map(int, time.split(':'))

        if am_pm == 'PM' and hour != 12:
            hour += 12
        elif am_pm == 'AM' and hour == 12:
            hour = 0

        return date_obj.replace(hour=hour, minute=minute)
    except Exception as e:
        print(f"날짜 파싱 오류: {date_str}. 오류 내용: {str(e)}")
        return datetime.now()

@lru_cache(maxsize=1024)
def get_news_metadata(news_id: int, db: Session):
    """뉴스 메타데이터 가져오기"""
    news = db.query(News).filter(News.news_id == news_id).first()
    if news and isinstance(news.published_date, str):
        news.published_date = parse_korean_date(news.published_date)
    return news

# 시간대별 뉴스 인기도 계산하기 (스크랩 기반)
def get_time_based_popularity(db: Session) -> Dict[int, Dict[str, int]]:
    current_time = datetime.now()
    one_day_ago = current_time - timedelta(days=1)
    reads = db.query(UserNewsScrap).filter(UserNewsScrap.scraped_date >= one_day_ago).all()

    time_based_popularity = defaultdict(lambda: {'아침': 0, '오후': 0, '저녁': 0, '밤': 0})
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


#####################################
# 5. 사용자 뉴스 읽기 패턴 분석
#####################################
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

#####################################
# 추천 로직
#####################################
def collaborative_filtering(user_id: int, db: Session, limit: int = 100) -> List[tuple]:
    """협업 필터링 기반 추천"""
    similar_users = find_similar_users(user_id, db, limit)
    user_categories = get_user_categories(user_id, db)
    user_category_ids = {uc.category_id for uc in user_categories}
    recommended_news = []
    current_time = datetime.now()

    for similar_user_id in similar_users:
        similar_user_clicks = get_user_click_log(similar_user_id, limit)
        for click in similar_user_clicks:
            if not user_news_click.find_one({"user_id": user_id, "news_id": click["news_id"]}):
                news_metadata = get_news_metadata(click["news_id"], db)

                if not news_metadata:
                    continue

                # 가중치 계산
                weight = 0

                # 1) 카테고리(관심도)에 따른 가중치
                if news_metadata.category_id in user_category_ids:
                    weight += 2  # 가중치 2 (관심 카테고리)
                else:
                    weight += 1  # 가중치 1 (비관심 카테고리)

                # 2) 조회수에 따른 가중치
                weight += news_metadata.hit / 10  # 조회수를 10으로 나누어 가중치 부여

                # 3) 작성 시간(최신)에 따른 가중치
                if isinstance(news_metadata.published_date, datetime):
                    time_diff = (current_time - news_metadata.published_date).total_seconds() / 3600
                    if time_diff < 24:  # 24시간 이내의 뉴스에 추가 가중치
                        weight += 1  # 최신 뉴스에 가중치 1 추가

                # 추천 뉴스 수집
                recommended_news.append((click["news_id"], news_metadata.title, news_metadata.category_id, weight, news_metadata.published_date, news_metadata.hit))

    # 가중치 기준으로 추천 뉴스 정렬
    return sorted(recommended_news, key=lambda x: x[3], reverse=True)[:20]

def content_based_filtering(user_id: int, db: Session, limit: int = 100) -> List[tuple]:
    """컨텐츠 기반 필터링 추천"""

    # 사용자 정보 가져오기
    user_categories = get_user_categories(user_id, db)
    user_category_ids = {uc.category_id for uc in user_categories}
    user_clicks = get_user_click_log(user_id)
    user_difficulty = get_user_difficulty(user_id, db)
    user_time_pattern = get_user_time_pattern(user_id, db)

    # 시간 및 난이도 기반 인기도 정보
    time_based_popularity = get_time_based_popularity(db)
    difficulty_based_popularity = get_difficulty_based_popularity(db)

    recommended_news = []
    current_time = datetime.now()

    # 전체 뉴스 가져오기 (제한된 개수)
    all_news = db.query(News).limit(limit).all()
    clicked_news_ids = {click["news_id"] for click in user_clicks}

    # 뉴스 제목 벡터화
    news_titles = tuple(news.title for news in all_news)
    title_vectors, vectorizer = vectorize_titles(news_titles)

    # 사용자와 유사한 뉴스 찾기
    user_vector_index = -1
    for index, news in enumerate(all_news):
        if news.category_id in user_category_ids:
            user_vector_index = index
            break

    if user_vector_index == -1:
        print("사용자 카테고리에 맞는 뉴스가 없습니다.")
        return []

    user_vector = title_vectors[user_vector_index].reshape(1, -1)
    similarity_scores = cosine_similarity(user_vector, title_vectors).flatten()

    # 뉴스 추천 가중치 계산
    for index, news in enumerate(all_news):
        if news.news_id not in clicked_news_ids:
            weight = 0

            # 1) 카테고리 관심도에 따른 가중치
            if news.category_id in user_category_ids:
                weight += 2
            else:
                weight += 1

            # 2) 유사도 점수 가중치
            weight += similarity_scores[index]

            # 3) 조회수 가중치
            weight += news.hit / 100

            # 4) 시간대별 인기도 가중치
            news_time_popularity = time_based_popularity.get(news.news_id, {})
            for time_period, popularity in news_time_popularity.items():
                weight += popularity * user_time_pattern.get(time_period, 0) / 10

            # 5) 난이도 스크랩 수에 따른 가중치
            news_difficulty_popularity = difficulty_based_popularity.get(news.news_id, {})
            weight += news_difficulty_popularity.get(user_difficulty, 0) / 100

            # 6) 작성 시간(최신성)에 따른 가중치
            if isinstance(news.published_date, datetime):
                time_diff = (current_time - news.published_date).total_seconds() / 3600
                if time_diff < 24:
                    weight += 1

            # 추천 뉴스 리스트에 추가
            recommended_news.append((news.news_id, news.title, weight, news.published_date, news.hit))

    # 가중치 기준으로 뉴스 정렬
    return sorted(recommended_news, key=lambda x: x[2], reverse=True)[:20]

def hybrid_recommendation(user_id: int, db: Session) -> List[tuple]:
    """하이브리드 추천 (협업 필터링 + 컨텐츠 기반 필터링)"""
    collaborative_recommendations = collaborative_filtering(user_id, db)
    content_recommendations = content_based_filtering(user_id, db)

    all_recommendations = {news[0]: news for news in collaborative_recommendations + content_recommendations}

    return sorted(all_recommendations.values(), key=lambda x: x[2], reverse=True)[:20]