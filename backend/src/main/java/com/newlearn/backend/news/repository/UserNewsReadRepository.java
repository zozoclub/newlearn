package com.newlearn.backend.news.repository;

import com.newlearn.backend.news.model.News;
import com.newlearn.backend.news.model.UserNewsRead;
import com.newlearn.backend.user.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserNewsReadRepository extends JpaRepository<UserNewsRead, Long> {
    Optional<UserNewsRead> findByUserAndNews(Users user, News news);
    List<UserNewsRead> findAllByUserUserId(Long userId); //사용자의 뉴스 읽음 상태 전부 가져오기
    List<UserNewsRead> findAllByUserUserIdAndNewsCategoryCategoryId(Long userId, Long categoryId); //사용자의 특정 카테고리에 속한 뉴스의 읽음 상태만 가져오기
    List<UserNewsRead> findAllByUserAndNewsNewsIdIn(Users user, List<Long> newsIds);

}