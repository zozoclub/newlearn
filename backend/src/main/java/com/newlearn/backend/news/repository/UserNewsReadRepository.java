package com.newlearn.backend.news.repository;

import com.newlearn.backend.news.model.News;
import com.newlearn.backend.news.model.UserNewsRead;
import com.newlearn.backend.user.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserNewsReadRepository extends JpaRepository<UserNewsRead, Long> {
    Optional<UserNewsRead> findByUserAndNews(Users user, News news);
    List<UserNewsRead> findAllByUserUserId(Long userId);
}