package com.newlearn.backend.recommend.service;

import com.newlearn.backend.news.dto.response.NewsSimpleResponseDTO;
import com.newlearn.backend.recommend.dto.NewsRecommendationDTO;
import com.newlearn.backend.user.model.Users;

import java.util.List;

public interface RecommendationService {

    List<NewsSimpleResponseDTO> recommendContentNews(Long newsId);
    List<NewsSimpleResponseDTO> recommendCategoryNews(Users user);
    List<NewsSimpleResponseDTO> recommendHybridNews(Users user);
//    List<NewsRecommendationDTO> recommendCfNews(int userId);
//    List<NewsRecommendationDTO> recommendCbfNews(int userId);

}