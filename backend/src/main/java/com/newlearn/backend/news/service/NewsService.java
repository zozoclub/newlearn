package com.newlearn.backend.news.service;


import com.newlearn.backend.news.dto.request.AllNewsRequestDTO;
import com.newlearn.backend.news.dto.request.NewsReadRequestDTO;
import com.newlearn.backend.news.dto.response.NewsResponseDTO;
import org.springframework.data.domain.Page;

import java.util.List;

public interface NewsService {

    // 전체 뉴스 조회
    Page<NewsResponseDTO> getAllNews(Long userId, AllNewsRequestDTO newsRequestDTO);

    // 카테고리 별 전체 뉴스 조회
    Page<NewsResponseDTO> getNewsByCategory(Long userId, AllNewsRequestDTO newsRequestDTO, long categoryId);

    // 매일 TOP 10 뉴스 조회


    // 뉴스 상세 조회

    // 뉴스 읽음 처리
    void readNews(Long userId, NewsReadRequestDTO newsReadRequestDTO);

    // 뉴스 스크랩
    void scrapNews(Long userId, NewsReadRequestDTO newsReadRequestDTO);

    // 뉴스 스크랩 취소
}
