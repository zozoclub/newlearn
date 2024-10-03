package com.newlearn.backend.recommend.service;

import com.newlearn.backend.news.dto.response.NewsSimpleResponseDTO;
import com.newlearn.backend.recommend.dto.NewsRecommendationDTO;
import java.util.List;

public interface RecommendationService {

    List<NewsSimpleResponseDTO> recommendContentNews(long newsId);
    List<NewsRecommendationDTO> recommendCategoryNews(int userId);
    List<NewsRecommendationDTO> recommendCfNews(int userId);
    List<NewsRecommendationDTO> recommendCbfNews(int userId);
    List<NewsRecommendationDTO> recommendHybridNews(int userId);

}