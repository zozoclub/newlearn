package com.newlearn.backend.news.repository.mongo;

import com.newlearn.backend.news.model.UserNewsClick;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface UserNewsClickRepository extends MongoRepository<UserNewsClick, String> {
    boolean existsByUserIdAndNewsId(Long userId, Long newsId); // userId와 newsId로 존재 여부 확인
    Optional<UserNewsClick> findByUserIdAndNewsId(Long userId, Long newsId); // userId와 newsId로 데이터 찾기
    List<UserNewsClick> findByUserIdOrderByCreatedAtDesc(Long userId);
}
