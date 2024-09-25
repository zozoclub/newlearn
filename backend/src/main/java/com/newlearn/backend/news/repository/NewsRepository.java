package com.newlearn.backend.news.repository;

import com.newlearn.backend.news.model.News;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NewsRepository extends JpaRepository<News, Long> {

    // 전체 뉴스 & 카테고리 뉴스 조회 (news_id 로 정렬)
    // List<News> findAllByOrderByNewsIdDesc();
    // 페이지네이션을 위한 메소드
    Page<News> findAllByOrderByNewsIdDesc(Pageable pageable);
    Page<News> findAllByCategoryCategoryIdOrderByNewsIdDesc(Long categoryId, Pageable pageable);
}
