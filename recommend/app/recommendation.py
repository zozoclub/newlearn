import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Tuple
from datetime import datetime, timedelta

from app.models import News
from app.models import UserNewsRead, UserCategory
from app.crud import get_user_category

from app.hybrid_recommendation import get_news_metadata, parse_korean_date

###############################################################################
# 현재 기사 - 컨텐츠 기반 뉴스 추천
class NewsContentsRecommender:
    def __init__(self, db: Session, max_news: int = 2000):
        self.db = db
        self.max_news = max_news
        self.tfidf_vectorizer = TfidfVectorizer(stop_words='english')
        self.update_news_data()

    def update_news_data(self):
        """현재 보는 뉴스 데이터 업데이트"""
        self.all_news = self.db.query(News).order_by(News.published_date.desc()).limit(self.max_news).all()

        self.categories = [news.category_id for news in self.all_news] # 카테고리
        self.contents = [news.title + ' ' + news.content for news in self.all_news] # 제목 + 본문 결합해서 하나의 feature로 사용

        # TF-IDF 벡터화
        self.tfidf_matrix = self.tfidf_vectorizer.fit_transform(self.contents)

    def get_hit_weight(self, hits: int) -> float:
        """조회수 가중치 계산"""
        return np.log1p(hits)  # log(1 + hits)를 사용하여 극단적인 차이 완화

    def get_date_weight(self, published_date: str) -> float:
        """날짜 가중치 계산"""
        published_date = parse_korean_date(published_date) # news테이블 작성시간이 string이라서 변경
        days_old = (datetime.now() - published_date).days
        return np.exp(-days_old / 30)  # 30일을 기준으로 지수 감소

    def recommend_articles(self, news_id: int, top_n: int = 20) -> List[Tuple[int, str, int, float, int, datetime]]:
        """기사 추천"""
        current_news = get_news_metadata(news_id, self.db)
        if not current_news:
            return []

        current_index = self.all_news.index(current_news)
        current_vector = self.tfidf_matrix[current_index]

        similarities = cosine_similarity(current_vector, self.tfidf_matrix).flatten()

        weighted_similarities = []
        for i, sim in enumerate(similarities):
            if i != current_index:
                news = self.all_news[i]
                hit_weight = self.get_hit_weight(news.hit)
                date_weight = self.get_date_weight(news.published_date)
                category_bonus = 1.2 if news.category_id == current_news.category_id else 1.0
                weighted_sim = sim * hit_weight * date_weight * category_bonus
                weighted_similarities.append((i, weighted_sim))

        top_indices = sorted(weighted_similarities, key=lambda x: x[1], reverse=True)[:top_n]

        recommendations = []
        for idx, score in top_indices:
            news = self.all_news[idx]
            recommendations.append((
                news.news_id,
                news.title,
                news.category_id,
                float(score),
                news.published_date,
                news.hit
            ))
        return recommendations

###############################################################################
# 임시 - 카테고리 추천 (랜덤으로)
def get_random_articles_by_categories(db: Session, user_categories: List[UserCategory]) -> List[Tuple[int, str, int, float, datetime, int]]:
    results = []
    for category in user_categories:
        # 각 카테고리에 대해 news 테이블에서 랜덤으로 5개의 레코드를 선택
        random_articles = db.query(News.news_id, News.title, News.category_id, News.published_date, News.hit) \
            .filter(News.category_id == category.category_id) \
            .order_by(func.random()) \
            .limit(5) \
            .all()
        # 선택된 레코드의 정보를 results 리스트에 추가
        results.extend([(article.news_id, article.title, article.category_id, 0.0, article.published_date, article.hit) for article in random_articles])
    return results

def get_news_recomm_by_categories(user_id: int, db: Session):
    user_categories = get_user_category(db, user_id)
    recommended_news  = get_random_articles_by_categories(db, user_categories)
    return recommended_news
###############################################################################