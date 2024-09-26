package com.newlearn.backend.news.repository;

import com.newlearn.backend.news.model.News;
import com.newlearn.backend.news.model.UserNewsScrap;
import com.newlearn.backend.user.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserNewsScrapRepository extends JpaRepository<UserNewsScrap, Long> {
    Optional<UserNewsScrap> findByUserAndNews(Users user, News news);
    Optional<UserNewsScrap> findByUserAndNewsAndDifficulty(Users user, News news, Integer difficulty);
    boolean existsByUserAndNewsAndDifficulty(Users user, News news, Integer difficulty);

}
