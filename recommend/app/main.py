from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models import Base
from app.database import SessionLocal, engine
from app.recommendation import NewsContentsRecommender, get_news_recomm_by_categories
from app.hybrid_recommendation import collaborative_filtering, content_based_filtering, hybrid_recommendation

Base.metadata.create_all(bind=engine)

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 콘텐츠 기반 필터링 뉴스 추천 - 뉴스 상세 페이지
@app.get("/reccommendation/news/{news_id}")
def recommendation_contents_news(news_id: int, db: Session = Depends(get_db)):
    recommender = NewsContentsRecommender(db)

    recommended_news = recommender.recommend_articles(news_id, top_n=20)

    print("추천 결과:")
    for news_id, title, category_id, score, hit, published_date in recommended_news:
        print(f"뉴스 ID: {news_id}, 제목: {title}, 카테고리 ID: {category_id}, "
              f"점수: {score:.4f}, 조회수: {hit}, 작성일: {published_date}")

    if not recommended_news:
        raise HTTPException(status_code=404, detail="No news recommendations available.")
    return recommended_news

# 카테고리 추천 (임시)
@app.get("/recommendation/category/{user_id}")
def recommendation_category_news(user_id: int, db: Session = Depends(get_db)):
    recommended_news = get_news_recomm_by_categories(user_id, db)
    if not recommended_news:
        raise HTTPException(status_code=404, detail="No news recommendations available.")
    return recommended_news


# 하이브리드 추천 시스템 - 협업 필터링 (CF)
@app.get("/hybrid-recommendation/cf/{user_id}")
def recommend_cf_news(user_id: int, db: Session = Depends(get_db)):
    recommended_news = collaborative_filtering(user_id, db)
    if not recommended_news:
        raise HTTPException(status_code=404, detail="No news recommendations available.")
    return recommended_news

# 하이브리드 추천 시스템 - 컨텐츠 기반 필터링 (CBF)
@app.get("/hybrid-recommendation/cbf/{user_id}")
def recommend_cf_news(user_id: int, db: Session = Depends(get_db)):
    recommended_news = content_based_filtering(user_id, db)
    if not recommended_news:
        raise HTTPException(status_code=404, detail="No news recommendations available.")
    return recommended_news

# 하이브리드 추천 시스템
@app.get("/hybrid-recommendation/{user_id}")
def recommend_hybrid_news(user_id: int, db: Session = Depends(get_db)):
    recommended_news = hybrid_recommendation(user_id, db)
    if not recommended_news:
        raise HTTPException(status_code=404, detail="No news recommendations available.")
    return recommended_news
