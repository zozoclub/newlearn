import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Tuple
from datetime import datetime
import random
from functools import lru_cache

from models import News
from models import UserCategory
from crud import get_user_category

from hybrid_recommendation import parse_korean_date

###############################################################################
# 현재 기사 - 컨텐츠 기반 뉴스 추천
class NewsContentsRecommender:
    def __init__(self, db: Session, max_news: int = 500):
        self.db = db
        self.max_news = max_news
        self.tfidf_vectorizer = TfidfVectorizer(stop_words='english')
        self.update_news_data()

    def update_news_data(self):
        self.all_news = self.db.query(News.news_id, News.title, News.content, News.category_id, News.published_date, News.hit).order_by(News.news_id.desc()).limit(self.max_news).all()
        self.news_id_to_index = {news.news_id: index for index, news in enumerate(self.all_news)}

        self.contents = [news.title + ' ' + news.content for news in self.all_news]

        self.tfidf_matrix = self.tfidf_vectorizer.fit_transform(self.contents)

        self.hit_weights = np.array([self.get_hit_weight(news.hit) for news in self.all_news])
        self.date_weights = np.array([self.get_date_weight(news.published_date) for news in self.all_news])
        self.category_weights = np.array([news.category_id for news in self.all_news])

        # 미리 계산된 가중치 행렬
        self.precomputed_weights = self.hit_weights * self.date_weights

    @staticmethod
    @lru_cache(maxsize=1000)
    def get_hit_weight(hits: int) -> float:
        return np.log1p(hits)

    @staticmethod
    @lru_cache(maxsize=1000)
    def get_date_weight(published_date: str) -> float:
        published_date = parse_korean_date(published_date)
        days_old = (datetime.now() - published_date).days
        return np.exp(-days_old / 30)

    def compute_weighted_similarities(self, similarities, current_category, current_index):
        category_bonus = np.where(self.category_weights == current_category, 1.2, 1.0)
        weighted_similarities = similarities * self.precomputed_weights * category_bonus
        weighted_similarities[current_index] = -np.inf
        return weighted_similarities

    def recommend_articles(self, news_id: int, top_n: int = 20) -> List[Tuple[int, str, int, float, int, datetime]]:
        current_index = self.news_id_to_index.get(news_id)
        if current_index is None:
            return []

        current_vector = self.tfidf_matrix[current_index]

        # 코사인 유사도 계산 최적화
        similarities = cosine_similarity(current_vector, self.tfidf_matrix)[0]

        # 가중치 적용
        weighted_similarities = self.compute_weighted_similarities(
            similarities,
            self.all_news[current_index].category_id,
            current_index
        )

        # 부분 정렬을 사용하여 상위 N개 선택
        top_indices = np.argpartition(weighted_similarities, -top_n)[-top_n:]

        # 필요한 경우에만 정렬
        if top_n > 1:
            top_indices = top_indices[np.argsort(weighted_similarities[top_indices])][::-1]

        return [
            (self.all_news[idx].news_id,
             self.all_news[idx].title,
             self.all_news[idx].category_id,
             float(weighted_similarities[idx]),
             self.all_news[idx].published_date,
             self.all_news[idx].hit)
            for idx in top_indices
        ]
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
    random.shuffle(results)
    return results

def get_news_recomm_by_categories(user_id: int, db: Session):
    user_categories = get_user_category(db, user_id)
    recommended_news  = get_random_articles_by_categories(db, user_categories)
    return recommended_news
###############################################################################