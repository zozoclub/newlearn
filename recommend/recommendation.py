import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Tuple
from datetime import datetime
import random
from scipy.sparse import vstack
from functools import lru_cache

from models import News
from models import UserCategory
from crud import get_user_category

from hybrid_recommendation import parse_korean_date

###############################################################################
# 현재 기사 - 컨텐츠 기반 뉴스 추천
class NewsContentsRecommender:
    def __init__(self, db: Session, max_news: int = 1000):
        self.db = db
        self.max_news = max_news
        self.tfidf_vectorizer = TfidfVectorizer(stop_words='english')
        self.update_news_data()

    def update_news_data(self):
        # 뉴스 데이터 업데이트: 최신 뉴스 가져와서 TF-IDF 행렬 및 가중치 계산
        self.all_news = self.db.query(News.news_id, News.title, News.content, News.category_id, News.published_date,
                                      News.hit) \
            .order_by(News.news_id.desc()) \
            .limit(self.max_news) \
            .all()

        # 뉴스 ID를 인덱스로 매핑하는 딕셔너리 생성
        self.news_id_to_index = {news.news_id: index for index, news in enumerate(self.all_news)}

        # {제목 + 내용} 하나의 데이터로 활용 -> TF-IDF 행렬 생성
        contents = [f"{news.title} {news.content}" for news in self.all_news]
        self.tfidf_matrix = self.tfidf_vectorizer.fit_transform(contents)

        # 조회수, 날짜, 카테고리 - 가중치 계산
        self.hit_weights = np.array([self.get_hit_weight(news.hit) for news in self.all_news])
        self.date_weights = np.array([self.get_date_weight(news.published_date) for news in self.all_news])
        self.category_weights = np.array([news.category_id for news in self.all_news])

        # 조회수 & 날짜 가중치 미리 계산
        self.precomputed_weights = self.hit_weights * self.date_weights

    def get_news_data(self, news_id: int):
        # 주어진 뉴스 ID에 대한 데이터 가져오기
        index = self.news_id_to_index.get(news_id)
        if index is not None: # 찾은 경우 바로 index 리턴
            return index

        # 캐시에 없는 경우 데이터베이스에서 조회
        news = self.db.query(News).filter(News.news_id == news_id).first()
        if news is None:
            return None

        # 새로운 뉴스 데이터를 기존 데이터에 추가
        new_index = len(self.all_news)
        self.all_news.append(news)
        self.news_id_to_index[news_id] = new_index

        # TF-IDF 행렬 및 가중치 업데이트 #
        content = f"{news.title} {news.content}"
        new_vector = self.tfidf_vectorizer.transform([content])
        self.tfidf_matrix = vstack([self.tfidf_matrix, new_vector])

        self.hit_weights = np.append(self.hit_weights, self.get_hit_weight(news.hit))
        self.date_weights = np.append(self.date_weights, self.get_date_weight(news.published_date))
        self.category_weights = np.append(self.category_weights, news.category_id)
        self.precomputed_weights = np.append(self.precomputed_weights, self.hit_weights[-1] * self.date_weights[-1])

        return new_index

    def recommend_articles(self, news_id: int, top_n: int = 20) -> List[Tuple[int, str, int, float, int, datetime]]:
        # 주어진 뉴스 ID에 대한 추천 기사 생성
        current_index = self.get_news_data(news_id)
        if current_index is None:
            print(f"Warning: News ID {news_id} not found in the database")
            return []

        # 코사인 유사도 계산
        current_vector = self.tfidf_matrix[current_index]
        similarities = cosine_similarity(current_vector, self.tfidf_matrix)[0]

        # 가중치를 적용한 유사도 계산
        weighted_similarities = self.compute_weighted_similarities(
            similarities,
            self.all_news[current_index].category_id,
            current_index
        )

        # 상위 N개의 유사한 기사 선택
        top_indices = np.argpartition(weighted_similarities, -top_n)[-top_n:]
        top_indices = top_indices[np.argsort(weighted_similarities[top_indices])][::-1]

        # 추천 기사 정보 반환
        return [
            (self.all_news[idx].news_id,
             self.all_news[idx].title,
             self.all_news[idx].category_id,
             float(weighted_similarities[idx]),
             self.all_news[idx].published_date,
             self.all_news[idx].hit)
            for idx in top_indices
        ]

    def compute_weighted_similarities(self, similarities, current_category, current_index):
        # 유사도에 가중치 적용
        category_bonus = np.where(self.category_weights == current_category, 1.2, 1.0)
        weighted_similarities = similarities * self.precomputed_weights * category_bonus
        weighted_similarities[current_index] = -np.inf
        return weighted_similarities

    @staticmethod
    def get_hit_weight(hits: int) -> float:
        # 조회수에 대한 가중치 계산 (로그 스케일 사용)
        return np.log1p(hits)

    @staticmethod
    def get_date_weight(published_date: str) -> float:
        # 발행일에 대한 가중치 계산 (지수 감소 함수 사용)
        published_date = parse_korean_date(published_date)
        days_old = (datetime.now() - published_date).days
        return np.exp(-days_old / 30)


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