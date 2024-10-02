from collections import defaultdict
from functools import lru_cache

from sklearn.metrics import mean_squared_error, make_scorer
from sklearn.model_selection import GridSearchCV, train_test_split
from sklearn.neighbors import NearestNeighbors
from sqlalchemy.orm import Session
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from app.models import News, UserNewsRead, User, UserCategory
from pymongo.collection import Collection
from app.models import News
import numpy as np

def get_cbf_news(user_id: int, db: Session):
    # 사용자가 읽은 뉴스 기사 가져오기
    user_read_news = (
        db.query(News)
        .join(UserNewsRead)
        .filter(UserNewsRead.user_id == user_id)
        .all()
    )

    if not user_read_news:
        return []

    # 최근 뉴스 최대 100개 가져오기
    all_news = db.query(News).limit(100).all()

    # 제목 & 카테고리 기반 추천
    titles = [news.title for news in all_news]
    contents = [news.title + ' ' + str(news.category_id) for news in all_news]  # 제목과 카테고리를 결합하여 콘텐츠로 사용

    # TF-IDF 벡터화
    tfidf_vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf_vectorizer.fit_transform(contents)

    # 사용자 읽은 뉴스 기사의 TF-IDF 벡터 찾기
    user_vectors = tfidf_vectorizer.transform([news.title + ' ' + str(news.category_id) for news in user_read_news])

    # 코사인 유사도 계산
    cosine_sim = cosine_similarity(user_vectors, tfidf_matrix)

    # 추천할 뉴스 기사의 인덱스 찾기
    similar_news_indices = cosine_sim.argsort()[:, -6:][:, :-1]  # 자기 자신을 제외하고자 상위 6개 인덱스 선택
    print(f"Similar news indices : {similar_news_indices.shape}")

    recommended_news = {}
    for index_list in similar_news_indices:
        for index in index_list:
            if all_news[index] not in user_read_news:
                news = all_news[index]
                if news.news_id not in recommended_news:
                    recommended_news[news.news_id] = {
                        'news_id': news.news_id,
                        'title': news.title
                    }
                    # print(f"Added recommendation: {news.news_id} - {news.title}")
    print(f"Total recommendations: {len(recommended_news)}")
    return list(recommended_news.values())

# def get_cf_news(user_id: int, db: Session, user_news_click: Collection):
#     # MongoDB에서 해당 유저의 클릭 기록을 가져옴
#     user_clicks = list(user_news_click.find({"user_id": user_id}))
#
#     if not user_clicks:
#         return []
#
#     # MongoDB에서 모든 유저들의 클릭 기록을 가져옴
#     all_clicks = list(user_news_click.find())
#
#     # 유저 간 유사도 계산을 위한 데이터 구조
#     user_news_matrix = {}
#     for click in all_clicks:
#         if click['user_id'] not in user_news_matrix:
#             user_news_matrix[click['user_id']] = set()
#         user_news_matrix[click['user_id']].add(click['news_id'])
#
#     # Jaccard 유사도 계산 함수
#     def jaccard_similarity(set1, set2):
#         intersection = len(set1.intersection(set2))
#         union = len(set1.union(set2))
#         return intersection / union if union != 0 else 0
#
#     # Cosine 유사도 계산 함수
#     def cosine_similarity_score(set1, set2):
#         intersection = len(set1.intersection(set2))
#         norm1 = len(set1)
#         norm2 = len(set2)
#         return intersection / (norm1 * norm2) if norm1 and norm2 else 0
#
#     # 해당 유저의 클릭 기록과 다른 유저의 클릭 기록을 비교
#     user_similarity_jaccard = []
#     user_similarity_cosine = []
#
#     for other_user_id in user_news_matrix:
#         if other_user_id != user_id:
#             # Jaccard 유사도 계산
#             jaccard_sim = jaccard_similarity(user_news_matrix[user_id], user_news_matrix[other_user_id])
#             user_similarity_jaccard.append((other_user_id, jaccard_sim))
#
#             # Cosine 유사도 계산
#             cosine_sim = cosine_similarity_score(user_news_matrix[user_id], user_news_matrix[other_user_id])
#             user_similarity_cosine.append((other_user_id, cosine_sim))
#
#     # 유사도가 높은 순으로 정렬
#     user_similarity_jaccard.sort(key=lambda x: x[1], reverse=True)
#     user_similarity_cosine.sort(key=lambda x: x[1], reverse=True)
#
#     # 추천할 뉴스 세트
#     recommended_news = set()
#
#     # 유사한 유저들이 읽은 뉴스 중 현재 유저가 읽지 않은 뉴스 추천
#     for similar_user_id, _ in user_similarity_jaccard[:5]:  # Jaccard 유사도가 높은 상위 5명의 유저
#         similar_user_clicks = user_news_matrix[similar_user_id]
#         recommended_news.update(similar_user_clicks - user_news_matrix[user_id])
#
#     for similar_user_id, _ in user_similarity_cosine[:5]:  # Cosine 유사도가 높은 상위 5명의 유저
#         similar_user_clicks = user_news_matrix[similar_user_id]
#         recommended_news.update(similar_user_clicks - user_news_matrix[user_id])
#
#     # 추천된 뉴스 정보 가져오기
#     recommendations = []
#     for news_id in recommended_news:
#         news = db.query(News).filter(News.news_id == news_id).first()
#         if news:
#             recommendations.append({
#                 'news_id': news.news_id,
#                 'title': news.title
#             })
#
#     return recommendations

# 사용자-뉴스 매트릭스 생성

# 사용자-뉴스 매트릭스 생성
def get_user_news_matrix(db: Session):
    user_news_matrix = defaultdict(set)
    user_news_clicks = db.query(UserNewsRead).all()  # UserNewsRead 테이블에서 모든 클릭 기록을 가져옴
    for click in user_news_clicks:
        user_news_matrix[click.user_id].add(click.news_id)  # 사용자별로 읽은 뉴스 ID를 매트릭스에 저장
    return user_news_matrix

# 사용자-아이템 매트릭스 생성
def create_user_item_matrix(user_news_matrix):
    users = list(user_news_matrix.keys())
    news_items = set.union(*user_news_matrix.values())

    user_item_matrix = np.zeros((len(users), len(news_items)))
    news_to_index = {news: idx for idx, news in enumerate(news_items)}

    for i, user in enumerate(users):
        for news in user_news_matrix[user]:
            user_item_matrix[i, news_to_index[news]] = 1

    return user_item_matrix, users, list(news_items)

def get_cf_news(user_id: int, db: Session, n_recommendations: int = 10):
    # 사용자-뉴스 매트릭스 생성
    user_news_matrix = get_user_news_matrix(db)

    # 사용자가 읽은 뉴스가 없으면 빈 리스트 반환
    if user_id not in user_news_matrix or not user_news_matrix[user_id]:
        return []

    user_item_matrix, users, news_items = create_user_item_matrix(user_news_matrix)

    # KNN 모델 학습
    knn_model = NearestNeighbors(n_neighbors=5, metric='cosine')
    knn_model.fit(user_item_matrix)

    user_index = users.index(user_id)
    # 유사 사용자 찾기
    distances, indices = knn_model.kneighbors(user_item_matrix[user_index].reshape(1, -1))

    # 추천할 뉴스 집합 초기화
    recommended_news = set()
    for idx in indices.flatten():
        if idx != user_index:
            similar_user = users[idx]
            recommended_news.update(user_news_matrix[similar_user] - user_news_matrix[user_id])

    # 디버깅을 위한 출력
    print(f"Total recommended news before slicing: {len(recommended_news)}")
    print(f"n_recommendations: {n_recommendations}")

    # 추천 뉴스 반환 (최대 n_recommendations개)
    return list(recommended_news)[:n_recommendations]
