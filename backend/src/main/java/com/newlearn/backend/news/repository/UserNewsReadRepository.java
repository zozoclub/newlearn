package com.newlearn.backend.news.repository;

import com.newlearn.backend.news.model.News;
import com.newlearn.backend.news.model.UserNewsRead;
import com.newlearn.backend.user.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserNewsReadRepository extends JpaRepository<UserNewsRead, Long> {
    Optional<UserNewsRead> findByUserAndNews(Users user, News news);
    List<UserNewsRead> findAllByUser(Users user); //사용자의 뉴스 읽음 상태 전부 가져오기
    List<UserNewsRead> findAllByUserAndNewsCategoryCategoryId(Users user, Long categoryId); //사용자의 특정 카테고리에 속한 뉴스의 읽음 상태만 가져오기
    List<UserNewsRead> findAllByUserAndNewsNewsIdIn(Users user, List<Long> newsIds);
    List<UserNewsRead> findAllByUserAndNewsIn(Users user, List<News> news);
    long countByUserAndCategoryId(Users user, Long categoryId);
    long countByUser(Users user);
    List<UserNewsRead> findAllByUserAndNews_NewsIdIn(Users user, List<Long> newsIds);
}