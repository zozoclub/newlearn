from sqlalchemy.orm import Session
from app.models import User, News, UserNewsRead

def read_user_news(user_id: int, db: Session):
    return db.query(UserNewsRead).filter(UserNewsRead.user_id == user_id).all()
