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
    public ResponseEntity<List<NewsRecommendationDTO>> getContentBasedRecommendations(@PathVariable int newsId) {
        List<NewsRecommendationDTO> recommendations = recommendationService.getContentBasedRecommendations(newsId);
        return ResponseEntity.ok(recommendations);
    }

    @GetMapping("/category/{userId}")
    public ResponseEntity<List<NewsRecommendationDTO>> getCategoryBasedRecommendations(@PathVariable int userId) {
        List<NewsRecommendationDTO> recommendations = recommendationService.getCategoryBasedRecommendations(userId);
        return ResponseEntity.ok(recommendations);
    }

    @GetMapping("/hybrid/cf/{userId}")
    public ResponseEntity<List<NewsRecommendationDTO>> getCollaborativeFilteringRecommendations(@PathVariable int userId) {
        List<NewsRecommendationDTO> recommendations = recommendationService.getCollaborativeFilteringRecommendations(userId);
        return ResponseEntity.ok(recommendations);
    }

    @GetMapping("/hybrid/cbf/{userId}")
    public ResponseEntity<List<NewsRecommendationDTO>> getContentBasedFilteringRecommendations(@PathVariable int userId) {
        List<NewsRecommendationDTO> recommendations = recommendationService.getContentBasedFilteringRecommendations(userId);
        return ResponseEntity.ok(recommendations);
    }

    @GetMapping("/hybrid/{userId}")
    public ResponseEntity<List<NewsRecommendationDTO>> getHybridRecommendations(@PathVariable int userId) {
        List<NewsRecommendationDTO> recommendations = recommendationService.getHybridRecommendations(userId);
        return ResponseEntity.ok(recommendations);
    }
}