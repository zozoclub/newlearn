package com.newlearn.backend.recommend.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class NewsRecommendationDTO {

    private int newsId;
    private String title;
    private int categoryId;
    private double score;
    private LocalDateTime publishedDate;
    private int hit;

}