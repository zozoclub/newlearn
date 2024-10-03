from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models import Base
from app.database import SessionLocal, engine
from app.recommendation import get_cbf_news
from app.hybrid_recommendation import get_cf_news

Base.metadata.create_all(bind=engine)

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 콘텐츠 기반 필터링 (CBF) 뉴스 추천
@app.get("/cbf-news/{user_id}")
def read_cbf_recommendations(user_id: int, db: Session = Depends(get_db)):
    recommendations = get_cbf_news(user_id, db)  # Content Based Filtering
    print(recommendations)
    if not recommendations:
        raise HTTPException(status_code=404, detail="No CBF recommendations found")
    return {"recommendations": recommendations}

# 협업 필터링 (CF) 뉴스 추천
@app.get("/hybrid-recommendation/cf/{user_id}")
def recommend_cf_news(user_id: int, db: Session = Depends(get_db)):
    recommended_news = get_cf_news(user_id, db)
    if not recommended_news:
        raise HTTPException(status_code=404, detail="No news recommendations available.")
    return recommended_news