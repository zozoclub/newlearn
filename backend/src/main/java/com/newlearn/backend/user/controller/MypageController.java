package com.newlearn.backend.user.controller;

import com.newlearn.backend.common.ApiResponse;
import com.newlearn.backend.common.ErrorCode;
import com.newlearn.backend.news.dto.request.AllNewsRequestDTO;
import com.newlearn.backend.news.dto.response.NewsResponseDTO;
import com.newlearn.backend.news.model.News;
import com.newlearn.backend.news.service.NewsService;
import com.newlearn.backend.user.dto.request.NewsPagenationRequestDTO;
import com.newlearn.backend.user.dto.response.UserCategoryChartResponseDTO;
import com.newlearn.backend.user.dto.response.UserScrapedNewsResponseDTO;
import com.newlearn.backend.user.model.Users;
import com.newlearn.backend.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/mypage")
public class MypageController {

    private final UserService userService;
    private final NewsService newsService;

    // 스크랩한 뉴스 전체 리스트 조회
    @GetMapping("/news")
    public ApiResponse<?> getAllScrapedNewsList(Authentication authentication,
                                             @RequestParam(defaultValue = "0") int page,
                                             @RequestParam(defaultValue = "10") int size) throws Exception {
        try {
            Users user = userService.findByEmail(authentication.getName());
            if (user == null) {
                return ApiResponse.createError(ErrorCode.USER_NOT_FOUND);
            }

            NewsPagenationRequestDTO newsPagenationRequestDTO = NewsPagenationRequestDTO.builder()
                    .page(page)
                    .size(size)
                    .build();

            Page<UserScrapedNewsResponseDTO> newsList = userService.getScrapedNewsList(user.getUserId(), newsPagenationRequestDTO, 0);

            return ApiResponse.createSuccess(newsList, "사용자의 스크랩한 뉴스 전체 목록 조회 성공");
        } catch (Exception e) {
            log.error("사용자의 스크랩한 뉴스 전체 목록 불러오기 중 실패", e);
            return ApiResponse.createError(ErrorCode.NEWS_LIST_NOT_FOUND);
        }
    }

    // 스크랩한 뉴스 난이도별 리스트 조회
    @GetMapping("/news/{difficulty}")
    public ApiResponse<?> getScrapedNewsList(Authentication authentication,
                                     @PathVariable("difficulty") int difficulty,
                                     @RequestParam(defaultValue = "0") int page,
                                     @RequestParam(defaultValue = "10") int size) throws Exception {
        try {
            Users user = userService.findByEmail(authentication.getName());
            if (user == null) {
                return ApiResponse.createError(ErrorCode.USER_NOT_FOUND);
            }

            NewsPagenationRequestDTO newsPagenationRequestDTO = NewsPagenationRequestDTO.builder()
                    .page(page)
                    .size(size)
                    .build();

            Page<UserScrapedNewsResponseDTO> newsList = userService.getScrapedNewsList(user.getUserId(), newsPagenationRequestDTO, difficulty);

            return ApiResponse.createSuccess(newsList, "사용자의 스크랩한 뉴스 난이도별 목록 조회 성공");
        } catch (Exception e) {
            log.error("사용자의 스크랩한 뉴스 전체 목록 불러오기 중 실패", e);
            return ApiResponse.createError(ErrorCode.NEWS_LIST_NOT_FOUND);
        }
    }

    // 유저 잔디 조회 : 6개월치 날짜, 그 날 읽은 기사 횟수



    // 카테고리 차트 조회 : 카테고리 별 읽은 기사 횟수
    @GetMapping("/chart")
    public ApiResponse<?> getCategoryChart(Authentication authentication) throws Exception {
        try {
            Users user = userService.findByEmail(authentication.getName());
            if (user == null) {
                return ApiResponse.createError(ErrorCode.USER_NOT_FOUND);
            }
            UserCategoryChartResponseDTO chart = userService.getCategoryChart(user.getUserId());

            return ApiResponse.createSuccess(chart, "사용자의 카테고리별 읽은 횟수 차트 조회 성공");
        } catch (Exception e) {
            log.error("사용자의 카테고리별 읽은 횟수 차트 조회 중 실패", e);
            return ApiResponse.createError(ErrorCode.USER_NEWS_CHART_FAILED);
        }
    }


}
