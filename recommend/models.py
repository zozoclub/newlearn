from sqlalchemy import Column, BigInteger, String, Text, ForeignKey, TIMESTAMP
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = 'users'

    user_id = Column(BigInteger, primary_key=True, index=True)
    name = Column(String(50), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    nickname = Column(String(255), unique=True, nullable=False)
    difficulty = Column(BigInteger)

    # 유저 - 읽은 뉴스 기록
    news_reads = relationship("UserNewsRead", back_populates="user")

    # 유저 - 카테고리
    categories = relationship('UserCategory', back_populates='user')

    # 유저 - 스크랩한 뉴스
    scrapped_news = relationship("UserNewsScrap", back_populates="user")

class Category(Base):
    __tablename__ = 'category'

    category_id = Column(BigInteger, primary_key=True, index=True)
    category_name = Column(String(50), nullable=False)

    # 카테고리 - 유저
    users = relationship('UserCategory', back_populates='category')

    # 카테고리 - 뉴스
    news = relationship('News', back_populates='category')

class UserCategory(Base):
    __tablename__ = 'user_category'

    user_category_id = Column(BigInteger, primary_key=True, index=True)
    user_id = Column(BigInteger, ForeignKey('users.user_id', ondelete='CASCADE', onupdate='CASCADE'), nullable=False)
    category_id = Column(BigInteger, ForeignKey('category.category_id', ondelete='CASCADE', onupdate='CASCADE'), nullable=False)

    # 유저 카테고리
    user = relationship('User', back_populates='categories')
    category = relationship('Category', back_populates='users')

class News(Base):
    __tablename__ = 'news'

    news_id = Column(BigInteger, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    category_id = Column(BigInteger, ForeignKey('category.category_id', ondelete='SET NULL'), nullable=True)    # 카테고리
    hit = Column(BigInteger, default=0) # 조회수
    published_date = Column(TIMESTAMP, nullable=False)  # 작성 시간 ex) 2024. 09. 26. 오후 12:24

    # 뉴스 - 카테고리
    category = relationship('Category', back_populates='news')

    # 뉴스 - 읽은 뉴스 기록
    user_reads = relationship("UserNewsRead", back_populates="news")

    # 뉴스 - 스크랩한 뉴스 기록
    scrapped_by_users = relationship("UserNewsScrap", back_populates="news")

class UserNewsRead(Base):
    __tablename__ = 'user_news_read'

    user_news_read_id = Column(BigInteger, primary_key=True, index=True)
    user_id = Column(BigInteger, ForeignKey('users.user_id', ondelete='CASCADE'), nullable=False)
    news_id = Column(BigInteger, ForeignKey('news.news_id', ondelete='CASCADE'), nullable=False)

    # 읽은 뉴스 - 유저 관계
    user = relationship("User", back_populates="news_reads")
    news = relationship("News", back_populates="user_reads")

class UserNewsScrap(Base):
    __tablename__ = 'user_news_scrap'

    user_news_scrap_id = Column(BigInteger, primary_key=True, index=True)
    user_id = Column(BigInteger, ForeignKey('users.user_id', ondelete='CASCADE'), nullable=False)
    news_id = Column(BigInteger, ForeignKey('news.news_id', ondelete='CASCADE'), nullable=False)
    difficulty = Column(BigInteger)
    scraped_date = Column(TIMESTAMP, default=TIMESTAMP)

    user = relationship("User", back_populates="scrapped_news")
    news = relationship("News", back_populates="scrapped_by_users")
