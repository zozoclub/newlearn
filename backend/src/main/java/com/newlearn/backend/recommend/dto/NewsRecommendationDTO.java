package com.newlearn.backend.recommend.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
public class NewsRecommendationDTO {

    private Long newsId;
    private String title;
    private int categoryId;
    private double score;
//    private LocalDateTime publishedDate;
    private String publishedDate;
    private int hit;


    public static List<NewsRecommendationDTO> convertToNewsRecommendationDTOList(List<List<Object>> rawData) {
        return rawData.stream()
                .filter(item -> item.size() >= 6)
                .map(NewsRecommendationDTO::convertToNewsRecommendationDTO)
                .collect(Collectors.toList());
    }

    private static NewsRecommendationDTO convertToNewsRecommendationDTO(List<Object> item) {
        return NewsRecommendationDTO.builder()
                .newsId(((Number) item.get(0)).longValue())
                .title((String) item.get(1))
                .categoryId(((Number) item.get(2)).intValue())
                .score(((Number) item.get(3)).doubleValue())
                .publishedDate((String) item.get(4))
                .hit(((Number) item.get(5)).intValue())
                .build();
    }

}