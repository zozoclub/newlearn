package com.newlearn.backend.recommend.service;

import com.newlearn.backend.recommend.dto.NewsRecommendationDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class RecommendationServiceImpl implements RecommendationService {

    private final RestTemplate restTemplate;

    @Value("${fast-api.base.url}")
    private String fastApiBaseUrl;

    @Override
    public List<NewsRecommendationDTO> recommendContentNews(int newsId) {
        String url = fastApiBaseUrl + "/recommendation/news/" + newsId;
        return getNewsRecommendations(url);
    }

    @Override
    public List<NewsRecommendationDTO> recommendCategoryNews(int userId) {
        String url = fastApiBaseUrl + "/recommendation/category/" + userId;
        return getNewsRecommendations(url);
    }

    @Override
    public List<NewsRecommendationDTO> recommendCfNews(int userId) {
        String url = fastApiBaseUrl + "/hybrid-recommendation/cf/" + userId;
        return getNewsRecommendations(url);
    }

    @Override
    public List<NewsRecommendationDTO> recommendCbfNews(int userId) {
        String url = fastApiBaseUrl + "/hybrid-recommendation/cbf/" + userId;
        return getNewsRecommendations(url);
    }

    @Override
    public List<NewsRecommendationDTO> recommendHybridNews(int userId) {
        String url = fastApiBaseUrl + "/hybrid-recommendation/" + userId;
        return getNewsRecommendations(url);
    }

    private List<NewsRecommendationDTO> getNewsRecommendations(String url) {
        try {
            ResponseEntity<List<NewsRecommendationDTO>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<NewsRecommendationDTO>>() {}
            );

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return response.getBody();
            } else {
                log.error("Failed to retrieve recommendations: {}", response.getStatusCode());
                return List.of();   // 우선, 빈 리스트 반환하도록
            }
        } catch (HttpClientErrorException e) {
            log.error("HTTP error while fetching recommendations: {}", e.getMessage());
            return List.of();
        } catch (Exception e) {
            log.error("Error while fetching recommendations: {}", e.getMessage());
            return List.of();
        }
    }
}
