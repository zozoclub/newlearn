package com.newlearn.backend.recommend.controller;

import com.newlearn.backend.recommend.dto.NewsRecommendationDTO;
import com.newlearn.backend.recommend.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/recommend")
public class RecommendController {

    private final RecommendationService recommendationService;

    @GetMapping("/news/{newsId}")
    public ResponseEntity<List<NewsRecommendationDTO>> recommendContentNews(@PathVariable int newsId) {
        List<NewsRecommendationDTO> recommendations = recommendationService.recommendContentNews(newsId);
        if (recommendations.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(recommendations);
    }

    @GetMapping("/category/{userId}")
    public ResponseEntity<List<NewsRecommendationDTO>> recommendCategoryNews(@PathVariable int userId) {
        List<NewsRecommendationDTO> recommendations = recommendationService.recommendCategoryNews(userId);
        if (recommendations.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(recommendations);
    }

    @GetMapping("/hybrid/cf/{userId}")
    public ResponseEntity<List<NewsRecommendationDTO>> recommendCfNews(@PathVariable int userId) {
        List<NewsRecommendationDTO> recommendations = recommendationService.recommendCfNews(userId);
        if (recommendations.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(recommendations);
    }

    @GetMapping("/hybrid/cbf/{userId}")
    public ResponseEntity<List<NewsRecommendationDTO>> recommendCbfNews(@PathVariable int userId) {
        List<NewsRecommendationDTO> recommendations = recommendationService.recommendCbfNews(userId);
        if (recommendations.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(recommendations);
    }

    @GetMapping("/hybrid/{userId}")
    public ResponseEntity<List<NewsRecommendationDTO>> recommendHybridNews(@PathVariable int userId) {
        List<NewsRecommendationDTO> recommendations = recommendationService.recommendHybridNews(userId);
        if (recommendations.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(recommendations);
    }
}