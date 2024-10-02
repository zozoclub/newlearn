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

@lru_cache(maxsize=128)
def get_user_news_matrix(user_news_click):
    user_news_matrix = defaultdict(set)
    for click in user_news_click.find():
        user_news_matrix[click['user_id']].add(click['news_id'])
    return user_news_matrix

def create_user_item_matrix(user_news_matrix):
    users = list(user_news_matrix.keys())
    news_items = set.union(*user_news_matrix.values())

    user_item_matrix = np.zeros((len(users), len(news_items)))
    news_to_index = {news: idx for idx, news in enumerate(news_items)}

    for i, user in enumerate(users):
        for news in user_news_matrix[user]:
            user_item_matrix[i, news_to_index[news]] = 1

    return user_item_matrix, users, list(news_items)

def tune_knn_parameters(user_item_matrix):
    if len(user_item_matrix) < 10:  # 데이터가 충분하지 않으면 기본값 사용
        return NearestNeighbors(n_neighbors=5, metric='cosine')

    # 훈련/검증 세트 분할
    train_matrix, val_matrix = train_test_split(user_item_matrix, test_size=0.2, random_state=42)

    best_mse = float('inf')
    best_params = {}

    for n_neighbors in [5, 10, 15, 20]:
        for metric in ['cosine', 'euclidean']:
            knn = NearestNeighbors(n_neighbors=n_neighbors, metric=metric)
            knn.fit(train_matrix)

            # 검증 세트에 대한 예측
            _, indices = knn.kneighbors(val_matrix)
            val_pred = np.mean(train_matrix[indices], axis=1)

            mse = mean_squared_error(val_matrix, val_pred)

            if mse < best_mse:
                best_mse = mse
                best_params = {'n_neighbors': n_neighbors, 'metric': metric}

    return NearestNeighbors(**best_params)

def get_cf_news(user_id: int, db: Session, user_news_click: Collection, n_recommendations: int = 10):
    # 사용자의 뉴스 클릭 데이터를 기반으로 사용자-뉴스 매트릭스 생성
    user_news_matrix = get_user_news_matrix(user_news_click)

    # 사용자가 읽은 뉴스가 없으면 빈 리스트 반환
    if user_id not in user_news_matrix or not user_news_matrix[user_id]:
        return []

    user_item_matrix, users, news_items = create_user_item_matrix(user_news_matrix)

    # KNN 모델 튜닝 및 학습
    knn_model = tune_knn_parameters(user_item_matrix)
    knn_model.fit(user_item_matrix)

    user_index = users.index(user_id)
    # 유사 사용자 찾기
    distances, indices = knn_model.kneighbors(user_item_matrix[user_index].reshape(1, -1), n_neighbors=min(5, len(users) - 1))
    similar_users = [users[idx] for idx in indices.flatten() if idx != user_index]

    # 추천할 뉴스 집합 초기화
    recommended_news = set()
    for similar_user in similar_users:
        # 유사 사용자들이 읽은 뉴스 중 현재 사용자가 읽지 않은 뉴스 추가
        recommended_news.update(user_news_matrix[similar_user] - user_news_matrix[user_id])

    # 사용자의 관심 카테고리 가져오기
    user_categories = (
        db.query(UserCategory.category_id)
        .filter(UserCategory.user_id == user_id)
        .all()
    )
    user_categories = [category[0] for category in user_categories]  # 튜플 형태를 리스트로 변환

    # 카테고리 기반으로 추천 다양성 증가
    recommendations = []
    category_count = defaultdict(int)
    max_per_category = 3  # 카테고리당 최대 추천 수

    for news_id in recommended_news:
        news = db.query(News).filter(News.news_id == news_id).first()
        if news and category_count[news.category_id] < max_per_category:
            # 관심 카테고리에 해당하는 뉴스 우선 추천
            if news.category_id in user_categories:
                recommendations.append({
                    'news_id': news.news_id,
                    'title': news.title,
                    'category_id': news.category_id
                })
                category_count[news.category_id] += 1

            # 원하는 추천 수에 도달하면 중단
            if len(recommendations) >= n_recommendations:
                break

    # 추천 결과가 부족한 경우, 인기 있는 뉴스로 보충
    if len(recommendations) < n_recommendations:
        popular_news = db.query(News).order_by(News.hit.desc()).limit(n_recommendations).all()
        for news in popular_news:
            if len(recommendations) >= n_recommendations:
                break
            # 이미 추천된 뉴스가 아닐 경우 추가
            if news.news_id not in user_news_matrix[user_id] and news.news_id not in [r['news_id'] for r in recommendations]:
                recommendations.append({
                    'news_id': news.news_id,
                    'title': news.title,
                    'category_id': news.category_id
                })

    return recommendations

# 성능 평가를 위한 함수
def evaluate_recommendations(recommendations, actual_reads):
    precision = len(set(recommendations) & set(actual_reads)) / len(recommendations) if recommendations else 0
    recall = len(set(recommendations) & set(actual_reads)) / len(actual_reads) if actual_reads else 0
    f1_score = 2 * (precision * recall) / (precision + recall) if (precision + recall) > 0 else 0
    return {'precision': precision, 'recall': recall, 'f1_score': f1_score}