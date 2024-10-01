from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models import Base
from app.database import SessionLocal, engine
from app.recommendation import get_cbf_news

Base.metadata.create_all(bind=engine)

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/cbf-news/{user_id}")
def read_recommendations(user_id: int, db: Session = Depends(get_db)):
    recommendations = get_cbf_news(user_id, db)
    if not recommendations:
        raise HTTPException(status_code=404, detail="No recommendations found")
    print(recommendations)
    return {"recommendations": [{"title": news.title, "news_id": news.news_id} for news in recommendations]}
