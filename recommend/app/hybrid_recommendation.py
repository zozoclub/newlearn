from app.database import user_news_click
from app.models import UserCategory, News
from sqlalchemy.orm import Session

##################################### 데이터 처리

# 해당 유저의 user_news_click (MongoDB) 가져 오기
def get_user_click_log(user_id: int):
    return list(user_news_click.find({"user_id": user_id}))


# 다른 유저와 유사한 클릭 패턴 찾기
def find_similar_users(user_id: int):
    user_clicks = get_user_click_log(user_id)

    # MongoDB 내 user_news_click에서
    # 다른 유저 들의 클릭 로그를 가져와 유사한 유저 찾기
    all_users_clicks = user_news_click.find({"user_id": {"$ne": user_id}})
    similar_users = []

    for other_user_clicks in all_users_clicks:
        # 사용자 간 유사도 계산 (공통 뉴스 클릭 수)
        common_clicks = len(
            set([click["news_id"] for click in user_clicks]) & set([click["news_id"] for click in other_user_clicks]))
        if common_clicks > 0:
            similar_users.append(other_user_clicks["user_id"])

    return similar_users

# 해당 유저의 UserCategory (MySQl) 가져 오기
def get_user_categories(user_id: int, db: Session):
    return db.query(UserCategory).filter(UserCategory.user_id == user_id).all()

# News (MySQL) 가져 오기
def get_news_metadata(news_id: int, db: Session):
    return db.query(News).filter(News.news_id == news_id).first()


##################################### 협업 필터링 로직

def get_cf_news(user_id: int, db: Session):
    similar_users = find_similar_users(user_id)

    # 유저 관심 카테 고리 기반 가중치 추가
    user_categories = get_user_categories(user_id, db)
    user_category_ids = [uc.category_id for uc in user_categories]

    # 유사한 유저가 클릭한 뉴스 가져 오기
    recommended_news = {}
    for similar_user_id in similar_users:
        similar_user_clicks = get_user_click_log(similar_user_id)
        for click in similar_user_clicks:
            if not user_news_click.find_one({"user_id": user_id, "news_id": click["news_id"]}):
                news_metadata = get_news_metadata(click["news_id"], db)
                if news_metadata.category_id in user_category_ids:
                    recommended_news[click["news_id"]] = recommended_news.get(click["news_id"], 0) + 2  # 가중치 2
                else:
                    recommended_news[click["news_id"]] = recommended_news.get(click["news_id"], 0) + 1  # 가중치 1

    # 뉴스 데이터를 통해 뉴스 정보를 반환
    sorted_news_ids = sorted(recommended_news, key=recommended_news.get, reverse=True)
    return [get_news_metadata(news_id, db) for news_id in sorted_news_ids]