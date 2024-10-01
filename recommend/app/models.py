from sqlalchemy import Column, BigInteger, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = 'users'

    user_id = Column(BigInteger, primary_key=True, index=True)
    name = Column(String(50), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    nickname = Column(String(255), unique=True, nullable=False)

    # 유저 - 읽은 뉴스 기록
    news_reads = relationship("UserNewsRead", back_populates="user")

class News(Base):
    __tablename__ = 'news'

    news_id = Column(BigInteger, primary_key=True, index=True)
    category_id = Column(BigInteger, ForeignKey('category.category_id'), nullable=False)
    title = Column(Text, nullable=False)

    # 뉴스 - 읽은 뉴스 기록
    user_reads = relationship("UserNewsRead", back_populates="news")
    category = relationship("Category", back_populates="news")  # 카테고리와의 관계

class UserNewsRead(Base):
    __tablename__ = 'user_news_read'

    user_news_read_id = Column(BigInteger, primary_key=True, index=True)
    user_id = Column(BigInteger, ForeignKey('users.user_id'), nullable=False)
    news_id = Column(BigInteger, ForeignKey('news.news_id'), nullable=False)

    user = relationship("User", back_populates="news_reads")
    news = relationship("News", back_populates="user_reads")

class Category(Base):
    __tablename__ = 'category'

    category_id = Column(BigInteger, primary_key=True, index=True)
    category_name = Column(String(50), nullable=False)

    # 카테고리 - 뉴스
    news = relationship("News", back_populates="category")  # 뉴스와의 관계
