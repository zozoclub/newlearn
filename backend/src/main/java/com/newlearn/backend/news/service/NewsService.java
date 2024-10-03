package com.newlearn.backend.news.service;


import com.newlearn.backend.news.dto.request.NewsListRequestDTO;
import com.newlearn.backend.news.dto.request.NewsDetailRequestDTO;
import com.newlearn.backend.news.dto.request.NewsReadRequestDTO;
import com.newlearn.backend.news.dto.response.NewsDetailResponseDTO;
import com.newlearn.backend.news.dto.response.NewsResponseDTO;
import com.newlearn.backend.news.dto.response.NewsSimpleResponseDTO;
import com.newlearn.backend.user.model.Users;
import org.springframework.data.domain.Page;

import java.util.List;

public interface NewsService {

    // 전체 뉴스 조회
    Page<NewsResponseDTO> getAllNews(Users user, NewsListRequestDTO newsRequestDTO);

    // 카테고리 별 전체 뉴스 조회
    Page<NewsResponseDTO> getNewsByCategory(Users user, NewsListRequestDTO newsRequestDTO, long categoryId);

    // 매일 TOP 10 뉴스 조회
    List<NewsResponseDTO> getTodayTopNewsList(Users user, int difficulty, String lang);

    // 유저가 최근 본 뉴스 조회
    List<NewsSimpleResponseDTO> getRecentNews(Users user);

    // 뉴스 상세 조회
    NewsDetailResponseDTO getNewsDetail(Users user, Long newsId, NewsDetailRequestDTO newsDetailRequestDTO);

    // 뉴스 읽음 처리
    void readNews(Users user, NewsReadRequestDTO newsReadRequestDTO);

    // 뉴스 스크랩
    void scrapNews(Users user, NewsReadRequestDTO newsReadRequestDTO);

    // 뉴스 스크랩 취소
    void cancelScrapedNews(Users user, NewsReadRequestDTO newsReadRequestDTO);
}
