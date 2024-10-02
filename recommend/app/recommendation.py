from sqlalchemy.orm import Session
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from app.models import News, UserNewsRead

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

def get_cf_news(user_id: int, db: Session):
    pass