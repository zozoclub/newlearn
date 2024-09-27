package com.newlearn.backend.news.repository;

import com.newlearn.backend.news.model.News;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface NewsRepository extends JpaRepository<News, Long> {

    // 전체 뉴스 & 카테고리 뉴스 조회 (news_id 로 정렬)
    // List<News> findAllByOrderByNewsIdDesc();
    // 페이지네이션을 위한 메소드
    Page<News> findAllByOrderByNewsIdDesc(Pageable pageable);
    Page<News> findAllByCategoryCategoryIdOrderByNewsIdDesc(Long categoryId, Pageable pageable);

    // TOP10
    @Query(value = "SELECT n FROM News n WHERE n.publishedDate LIKE :today% ORDER BY n.hit DESC LIMIT 10")
    List<News> findTop10ByPublishedDateStartingWithOrderByHitDesc(@Param("today") String today);
}
