package com.newlearn.backend.news.controller;

import com.newlearn.backend.common.ApiResponse;
import com.newlearn.backend.common.ErrorCode;
import com.newlearn.backend.news.dto.request.AllNewsRequestDTO;
import com.newlearn.backend.news.dto.request.NewsReadRequestDTO;
import com.newlearn.backend.news.dto.response.NewsResponseDTO;
import com.newlearn.backend.news.service.NewsService;
import com.newlearn.backend.user.model.Users;
import com.newlearn.backend.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/news")
public class NewsController {

    private final UserService userService;
    private final NewsService newsService;

    // 전체 뉴스 조회
    @GetMapping
    public ApiResponse<?> getAllNews(Authentication authentication, @RequestParam("difficulty") int difficulty,
                                     @RequestParam("lang") String lang,
                                     @RequestParam(defaultValue = "0") int page,
                                     @RequestParam(defaultValue = "10") int size) throws Exception {
        try {
            Users user = userService.findByEmail(authentication.getName());
            if (user == null) {
                return ApiResponse.createError(ErrorCode.USER_NOT_FOUND);
            }

            AllNewsRequestDTO newsRequestDTO = AllNewsRequestDTO.builder()
                    .difficulty(difficulty)
                    .lang(lang)
                    .page(page)
                    .size(size)
                    .build();

            Page<NewsResponseDTO> newsList = newsService.getAllNews(user.getUserId(), newsRequestDTO);

            return ApiResponse.createSuccess(newsList, "전체 뉴스 조회 성공");
        } catch (Exception e) {
            log.error("뉴스 전체목록 불러오기 중 실패", e);
            return ApiResponse.createError(ErrorCode.NEWS_LIST_NOT_FOUND);
        }
    }

    // 카테고리 별 전체 뉴스 조회
    @GetMapping("/{category}")
    public ApiResponse<?> getAllNews(Authentication authentication,
                                     @PathVariable("category") long categoryId,
                                     @RequestParam("difficulty") int difficulty,
                                     @RequestParam("lang") String lang,
                                     @RequestParam(defaultValue = "0") int page,
                                     @RequestParam(defaultValue = "10") int size) throws Exception {
        try {
            Users user = userService.findByEmail(authentication.getName());
            if (user == null) {
                return ApiResponse.createError(ErrorCode.USER_NOT_FOUND);
            }

            AllNewsRequestDTO newsRequestDTO = AllNewsRequestDTO.builder()
                    .difficulty(difficulty)
                    .lang(lang)
                    .page(page)
                    .size(size)
                    .build();

            Page<NewsResponseDTO> newsList = newsService.getNewsByCategory(user.getUserId(), newsRequestDTO, categoryId);

            return ApiResponse.createSuccess(newsList, categoryId + " 카테고리 뉴스 조회 성공");
        } catch (Exception e) {
            log.error("뉴스 전체목록 불러오기 중 실패", e);
            return ApiResponse.createError(ErrorCode.NEWS_LIST_NOT_FOUND);
        }
    }

    // 매일 TOP10 뉴스 조회

    // 뉴스 상세 조회


    // 뉴스 읽음 처리
    @PostMapping("/read/{newsId}/{difficulty}")
    public ApiResponse<?> readNews(Authentication authentication,
                                   @PathVariable("newsId") long newsId,
                                   @PathVariable("difficulty") int difficulty) throws Exception {
        try {
            Users user = userService.findByEmail(authentication.getName());
            if (user == null) {
                return ApiResponse.createError(ErrorCode.USER_NOT_FOUND);
            }

            NewsReadRequestDTO newsReadRequestDTO = NewsReadRequestDTO.builder()
                    .newsId(newsId)
                    .difficulty(difficulty)
                    .build();

            newsService.readNews(user.getUserId(), newsReadRequestDTO); //뉴스 읽음 처리

            return ApiResponse.createSuccessWithNoContent("뉴스 읽음 처리 성공");
        } catch (Exception e) {
            log.error("뉴스 읽음 처리 중 실패", e);
            return ApiResponse.createError(ErrorCode.NEWS_READ_FAILED);
        }

    }

    // 뉴스 스크랩
    @PostMapping("/scrap/{newsId}/{difficulty}")
    public ApiResponse<?> scrapNews(Authentication authentication,
                                   @PathVariable("newsId") long newsId,
                                   @PathVariable("difficulty") int difficulty) throws Exception {
        try {
            Users user = userService.findByEmail(authentication.getName());
            if (user == null) {
                return ApiResponse.createError(ErrorCode.USER_NOT_FOUND);
            }

            NewsReadRequestDTO newsReadRequestDTO = NewsReadRequestDTO.builder()
                    .newsId(newsId)
                    .difficulty(difficulty)
                    .build();

            newsService.scrapNews(user.getUserId(), newsReadRequestDTO); //뉴스 읽음 처리

            return ApiResponse.createSuccessWithNoContent("뉴스 스크랩 처리 성공");
        } catch (Exception e) {
            log.error("뉴스 스크랩 처리 중 실패", e);
            return ApiResponse.createError(ErrorCode.NEWS_SCRAP_FAILED);
        }

    }


    // 뉴스 스크랩 취소



    /* 추천 */

}