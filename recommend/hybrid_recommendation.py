from database import user_news_click
from models import UserCategory, News, User, UserNewsScrap
from sqlalchemy.orm import Session
import numpy as np
from typing import Dict, List, Tuple, Set
from collections import defaultdict
from datetime import datetime, timedelta
import locale
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import OneHotEncoder
from functools import lru_cache
from konlpy.tag import Okt

# 한글 로케일 설정
locale.setlocale(locale.LC_TIME, 'ko_KR.UTF-8')

# Okt 형태소 분석기 초기화
okt = Okt()

# 원-핫 인코더 초기화
encoder = OneHotEncoder(sparse_output=False)

#####################################
# 1. 사용자 데이터 가져오기
#####################################
@lru_cache(maxsize=1024)
def get_user_categories(user_id: int, db: Session) -> np.ndarray:
    """해당 유저의 UserCategory (MySQL) 가져오기 및 원-핫 인코딩"""
    categories = db.query(UserCategory.category_id).filter(UserCategory.user_id == user_id).all()
    category_ids = np.array([category[0] for category in categories]).reshape(-1, 1)

    # 카테고리를 원-핫 인코딩하여 반환
    return encoder.fit_transform(category_ids)

@lru_cache(maxsize=1024)
def get_user_difficulty(user_id: int, db: Session):
    """User (MySQL) 가져오기"""
    user = db.query(User).filter(User.user_id == user_id).first()
    return user.difficulty if user else None

def get_user_clicks_batch(user_ids: List[int], limit: int = 100) -> Dict[int, Set[int]]:
    """user_news_click을 한번에 가져오기"""
    clicks = user_news_click.find(
        {"user_id": {"$in": user_ids}},
        {"user_id": 1, "news_id": 1}
    ).limit(limit * len(user_ids))

    user_clicks = defaultdict(set)
    for click in clicks:
        user_clicks[click["user_id"]].add(click["news_id"])
    return user_clicks

@lru_cache(maxsize=1)
def get_popular_news_ids(limit: int = 1000) -> List[int]:
    """조회수 높은 news 일부만 가져오기"""
    pipeline = [
        {"$group": {"_id": "$news_id", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": limit},
        {"$project": {"_id": 1}}
    ]
    return [doc["_id"] for doc in user_news_click.aggregate(pipeline)]

#####################################
# 2. 데이터 전처리 및 유사도 계산
#####################################
@lru_cache(maxsize=1)
def tokenize_korean(text: str) -> List[str]:
    """한국어 텍스트를 형태소 분석하여 토큰화"""
    return okt.nouns(text)  # 명사만 추출하여 단순화, 필요에 따라 다른 형태소도 사용 가능

@lru_cache(maxsize=1)
def vectorize_titles(titles_tuple: Tuple[str, ...]) -> Tuple[np.ndarray, TfidfVectorizer]:
    """뉴스 제목을 벡터화하고 TF-IDF 벡터라이저 반환 (KoNLPy 사용)"""
    # KoNLPy를 사용한 형태소 분석을 통해 토큰화
    tokenized_titles = [' '.join(tokenize_korean(title)) for title in titles_tuple]

    # TF-IDF 벡터화
    vectorizer = TfidfVectorizer(tokenizer=lambda x: x.split(), token_pattern=None)  # 이미 공백으로 분리된 토큰 사용
    return vectorizer.fit_transform(tokenized_titles).toarray(), vectorizer

#####################################
# 3. 유사한 유저 찾기
#####################################
def find_similar_users(user_id: int, db: Session, limit: int = 100, top_k: int = 20):
    """코사인 유사도 기반으로 상위 K개의 유사한 사용자를 선택"""
    popular_news_ids = get_popular_news_ids(1000)  # 상위 1000개의 인기 뉴스만 고려

    # 대상 사용자와 다른 사용자들의 클릭 로그를 한 번에 가져옵니다
    other_user_ids = [doc["user_id"] for doc in user_news_click.find(
        {"user_id": {"$ne": user_id}},
        {"user_id": 1}
    ).limit(limit)]
    all_user_ids = [user_id] + other_user_ids
    all_user_clicks = get_user_clicks_batch(all_user_ids, limit)

    # 벡터화
    vectors = []
    for uid in all_user_ids:
        vector = np.array([1 if news_id in all_user_clicks[uid] else 0 for news_id in popular_news_ids])
        vectors.append(vector)

    # 코사인 유사도 계산
    similarities = cosine_similarity([vectors[0]], vectors[1:])[0]

    # 상위 K개의 유사한 사용자 선택
    top_similar_indices = np.argsort(similarities)[-top_k:][::-1]
    return [other_user_ids[i] for i in top_similar_indices if similarities[i] > 0]

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
@lru_cache(maxsize=1)
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
@lru_cache(maxsize=1)
def get_difficulty_based_popularity(db: Session) -> Dict[int, Dict[int, int]]:
    difficulty_popularity = defaultdict(lambda: {1: 0, 2: 0, 3: 0})
    scraps = db.query(UserNewsScrap).all()
    for scrap in scraps:
        difficulty_popularity[scrap.news_id][scrap.difficulty] += 1
    return dict(difficulty_popularity)

#####################################
# 5. 사용자 뉴스 읽기 패턴 분석
#####################################
@lru_cache(maxsize=1024)
def get_user_time_pattern(user_id: int, db: Session) -> Dict[str, float]:
    one_week_ago = datetime.now() - timedelta(days=7)
    user_scraps = db.query(UserNewsScrap).filter(
        UserNewsScrap.user_id == user_id,
        UserNewsScrap.scraped_date >= one_week_ago
    ).all()

    total_reads = len(user_scraps)
    time_pattern = {'아침': 0, '오후': 0, '저녁': 0, '밤': 0}

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

    # 비율로 변환
    if total_reads > 0:
        for key in time_pattern:
            time_pattern[key] = time_pattern[key] / total_reads

    return time_pattern

#####################################
# 추천 로직
#####################################
def collaborative_filtering(user_id: int, db: Session, limit: int = 100) -> List[tuple]:
    """최적화된 협업 필터링 기반 추천"""
    similar_users = find_similar_users(user_id, db, limit)
    user_categories = get_user_categories(user_id, db)
    current_time = datetime.now()

    all_user_ids = [user_id] + similar_users
    all_user_clicks = get_user_clicks_batch(all_user_ids, limit)

    user_clicks = all_user_clicks[user_id]
    recommended_news = set()

    for similar_user_id in similar_users:
        for news_id in all_user_clicks[similar_user_id]:
            if news_id not in user_clicks and news_id not in recommended_news:
                news_metadata = get_news_metadata(news_id, db)
                if not news_metadata:
                    continue

                weight = 0
                # 1) 카테고리(관심도)에 따른 가중치
                weight += 2 if news_metadata.category_id in user_categories else 1

                # 2) 조회수에 따른 가중치
                weight += news_metadata.hit / 10

                # 3) 작성 시간(최신)에 따른 가중치
                if isinstance(news_metadata.published_date, datetime):
                    time_diff = (current_time - news_metadata.published_date).total_seconds() / 3600
                    if time_diff < 24:
                        weight += 1

                recommended_news.add((news_id, news_metadata.title, news_metadata.category_id, weight, news_metadata.published_date, news_metadata.hit))

    return sorted(recommended_news, key=lambda x: x[3], reverse=True)[:20]

def content_based_filtering(user_id: int, db: Session, limit: int = 100) -> List[tuple]:
    """컨텐츠 기반 필터링 추천"""

    # 사용자 정보 가져오기
    user_categories = get_user_categories(user_id, db)  # 이미 Set[int]
    user_clicks = get_user_clicks_batch([user_id], limit)[user_id]
    user_difficulty = get_user_difficulty(user_id, db)
    user_time_pattern = get_user_time_pattern(user_id, db)

    # 시간 및 난이도 기반 인기도 정보
    time_based_popularity = get_time_based_popularity(db)
    difficulty_based_popularity = get_difficulty_based_popularity(db)

    recommended_news = []
    current_time = datetime.now()

    # 전체 뉴스 가져오기 (제한된 개수)
    all_news = db.query(News).limit(limit).all()
    clicked_news_ids = user_clicks

    # 뉴스 제목 벡터화
    news_titles = tuple(news.title for news in all_news)
    title_vectors, vectorizer = vectorize_titles(news_titles)

    # 사용자와 유사한 뉴스 찾기
    user_vector_index = -1
    for index, news in enumerate(all_news):
        if news.category_id in user_categories:
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
            if news.category_id in user_categories:
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
            recommended_news.append((news.news_id, news.title, news.category_id, weight, news.published_date, news.hit))

    # 가중치 기준으로 뉴스 정렬
    return sorted(recommended_news, key=lambda x: x[2], reverse=True)[:20]

def hybrid_recommendation(user_id: int, db: Session) -> List[tuple]:
    """하이브리드 추천 (협업 필터링 + 컨텐츠 기반 필터링)"""
    collaborative_recommendations = collaborative_filtering(user_id, db)
    content_recommendations = content_based_filtering(user_id, db)

    all_recommendations = {news[0]: news for news in collaborative_recommendations + content_recommendations}

    return sorted(all_recommendations.values(), key=lambda x: x[2], reverse=True)[:20]