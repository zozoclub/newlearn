package com.newlearn.backend.news.service;


import com.newlearn.backend.news.dto.request.AllNewsRequestDTO;
import com.newlearn.backend.news.dto.response.NewsResponseDTO;
import org.springframework.data.domain.Page;

import java.util.List;

public interface NewsService {

    // 전체 뉴스 조회
    Page<NewsResponseDTO> getAllNews(AllNewsRequestDTO newsRequestDTO);

    // 카테고리 별 전체 뉴스 조회

    // 매일 TOP 10 뉴스 조회


    // 뉴스 상세 조회

    // 뉴스 읽음 처리

    // 뉴스 스크랩

    // 뉴스 스크랩 취소
}
