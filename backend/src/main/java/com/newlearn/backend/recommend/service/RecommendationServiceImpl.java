package com.newlearn.backend.recommend.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.newlearn.backend.news.dto.response.NewsSimpleResponseDTO;
import com.newlearn.backend.news.model.News;
import com.newlearn.backend.news.repository.NewsRepository;
import com.newlearn.backend.recommend.dto.NewsRecommendationDTO;
import jakarta.persistence.EntityNotFoundException;
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
import java.util.stream.Collectors;

import com.fasterxml.jackson.databind.ObjectMapper;

import static com.newlearn.backend.recommend.dto.NewsRecommendationDTO.convertToNewsRecommendationDTOList;

@Slf4j
@Service
@RequiredArgsConstructor
public class RecommendationServiceImpl implements RecommendationService {

    private final RestTemplate restTemplate;
    private final NewsRepository newsRepository;
    private final ObjectMapper objectMapper;

    @Value("${fast-api.base.url}")
    private String fastApiBaseUrl;

    @Override
    public List<NewsSimpleResponseDTO> recommendContentNews(long newsId) {
        String url = fastApiBaseUrl + "/recommendation/news/" + newsId;

        List<NewsRecommendationDTO> responseList = getNewsRecommendations(url);

        List<NewsSimpleResponseDTO> recommendNewsList = responseList.stream()
                .map(one -> {
                    News news = newsRepository.findById(one.getNewsId())
                            .orElseThrow(() -> new EntityNotFoundException("News not found with id: " + one.getNewsId()));
                    return NewsSimpleResponseDTO.makeNewsSimpleResponseDTO(news);
                })
                .collect(Collectors.toList());
        return recommendNewsList;
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

    public List<NewsRecommendationDTO> getNewsRecommendations(String url) {
        try {
            ResponseEntity<String> responseEntity = restTemplate.getForEntity(url, String.class);

            if (responseEntity.getStatusCode().is2xxSuccessful() && responseEntity.getBody() != null) {
                List<List<Object>> rawData = objectMapper.readValue(responseEntity.getBody(),
                        new TypeReference<List<List<Object>>>() {});
                return convertToNewsRecommendationDTOList(rawData);
            } else {
                log.error("Failed to retrieve recommendations: {}", responseEntity.getStatusCode());
                return List.of();   // 우선, 빈 리스트 반환하도록
            }
        } catch (Exception e) {
            log.error("Error while fetching recommendations: {}", e.getMessage());
            return List.of();   // 우선, 빈 리스트 반환하도록
        }
    }
}
