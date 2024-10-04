from sqlalchemy.orm import Session
from models import News, UserNewsRead, UserCategory


def read_user_news(user_id: int, db: Session):
    return db.query(UserNewsRead).filter(UserNewsRead.user_id == user_id).all()

def get_news_all(db : Session):
    return db.query(News).limit(100).all()
    # news_df = pd.read_sql("SELECT * FROM news", con = engine)
    # return news_df

# 유저 관심 카테고리
def get_user_category(db: Session, user_id: int):
    return db.query(UserCategory).filter(UserCategory.user_id == user_id).all()
