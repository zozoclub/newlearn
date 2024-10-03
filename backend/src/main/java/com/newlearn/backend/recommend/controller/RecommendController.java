package com.newlearn.backend.recommend.controller;

import com.newlearn.backend.common.ApiResponse;
import com.newlearn.backend.common.ErrorCode;
import com.newlearn.backend.news.dto.response.NewsSimpleResponseDTO;
import com.newlearn.backend.recommend.dto.NewsRecommendationDTO;
import com.newlearn.backend.recommend.service.RecommendationService;
import com.newlearn.backend.user.model.Users;
import com.newlearn.backend.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/recommend")
public class RecommendController {

    private final RecommendationService recommendationService;
    private final UserService userService;

    // [뉴스 상세보기 ] 뉴스 컨텐츠 기반 추천
    @GetMapping("/news/{newsId}")
    public ApiResponse<?> recommendContentNews(Authentication authentication, @PathVariable long newsId) {
        try {
            Users user = userService.findByEmail(authentication.getName());
            if (user == null) {
                return ApiResponse.createError(ErrorCode.USER_NOT_FOUND);
            }

            List<NewsSimpleResponseDTO> recommendations = recommendationService.recommendContentNews(newsId);
            return ApiResponse.createSuccess(recommendations, "현재 보고있는 뉴스와 연관있는 뉴스 추천 목록 불러오기 성공");
        } catch (Exception e) {
            log.error("컨텐츠기반 뉴스 추천 실패", e);
            return ApiResponse.createError(ErrorCode.NEWS_RECOMM_CONTENTS_FAILED);
        }
    }
    @GetMapping("/hybrid")
    public ApiResponse<?> recommendHybridNews(Authentication authentication) {
        try {
            Users user = userService.findByEmail(authentication.getName());
            if (user == null) {
                return ApiResponse.createError(ErrorCode.USER_NOT_FOUND);
            }

            List<NewsSimpleResponseDTO> recommendations = recommendationService.recommendHybridNews(user);
            return ApiResponse.createSuccess(recommendations, "하이브리드 뉴스 추천 목록 불러오기 성공");
        } catch (Exception e) {
            log.error("하이브리드 기반 뉴스 추천 실패", e);
            return ApiResponse.createError(ErrorCode.NEWS_RECOMM_HYBRID_FAILED);
        }
    }

    @GetMapping("/category")
    public ApiResponse<?> recommendCategoryNews(Authentication authentication) {
        try {
            Users user = userService.findByEmail(authentication.getName());
            if (user == null) {
                return ApiResponse.createError(ErrorCode.USER_NOT_FOUND);
            }

            List<NewsSimpleResponseDTO> recommendations = recommendationService.recommendCategoryNews(user);
            return ApiResponse.createSuccess(recommendations, "카테고리 뉴스 랜덤 목록 불러오기 성공");
        } catch (Exception e) {
            log.error("카테고리 랜덤 뉴스 추천 실패", e);
            return ApiResponse.createError(ErrorCode.NEWS_RECOMM_CATEGORY_FAILED);
        }
    }

//    @GetMapping("/hybrid/cf/{userId}")
//    public ResponseEntity<List<NewsRecommendationDTO>> recommendCfNews(@PathVariable int userId) {
//        List<NewsRecommendationDTO> recommendations = recommendationService.recommendCfNews(userId);
//        if (recommendations.isEmpty()) {
//            return ResponseEntity.notFound().build();
//        }
//        return ResponseEntity.ok(recommendations);
//    }
//
//    @GetMapping("/hybrid/cbf/{userId}")
//    public ResponseEntity<List<NewsRecommendationDTO>> recommendCbfNews(@PathVariable int userId) {
//        List<NewsRecommendationDTO> recommendations = recommendationService.recommendCbfNews(userId);
//        if (recommendations.isEmpty()) {
//            return ResponseEntity.notFound().build();
//        }
//        return ResponseEntity.ok(recommendations);
//    }



}