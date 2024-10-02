package com.newlearn.backend.news.controller;

import com.newlearn.backend.common.ApiResponse;
import com.newlearn.backend.common.ErrorCode;
import com.newlearn.backend.news.dto.request.NewsListRequestDTO;
import com.newlearn.backend.news.dto.request.NewsDetailRequestDTO;
import com.newlearn.backend.news.dto.request.NewsReadRequestDTO;
import com.newlearn.backend.news.dto.response.NewsDetailResponseDTO;
import com.newlearn.backend.news.dto.response.NewsResponseDTO;
import com.newlearn.backend.news.dto.response.NewsSimpleResponseDTO;
import com.newlearn.backend.news.service.NewsService;
import com.newlearn.backend.search.dto.response.SearchNewsDTO;
import com.newlearn.backend.user.model.Users;
import com.newlearn.backend.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
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

            NewsListRequestDTO newsRequestDTO = NewsListRequestDTO.builder()
                    .difficulty(difficulty)
                    .lang(lang)
                    .page(page)
                    .size(size)
                    .build();

            Page<NewsResponseDTO> newsList = newsService.getAllNews(user, newsRequestDTO);

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

            NewsListRequestDTO newsRequestDTO = NewsListRequestDTO.builder()
                    .difficulty(difficulty)
                    .lang(lang)
                    .page(page)
                    .size(size)
                    .build();

            Page<NewsResponseDTO> newsList = newsService.getNewsByCategory(user, newsRequestDTO, categoryId);

            return ApiResponse.createSuccess(newsList, categoryId + " 카테고리 뉴스 조회 성공");
        } catch (Exception e) {
            log.error("뉴스 전체목록 불러오기 중 실패", e);
            return ApiResponse.createError(ErrorCode.NEWS_LIST_NOT_FOUND);
        }
    }

    // 매일 TOP10 뉴스 조회
    @GetMapping("/top")
    public ApiResponse<?> getTodayTopNews(Authentication authentication,
                                     @RequestParam("difficulty") int difficulty,
                                     @RequestParam("lang") String lang) throws Exception {
        try {
            Users user = userService.findByEmail(authentication.getName());
            if (user == null) {
                return ApiResponse.createError(ErrorCode.USER_NOT_FOUND);
            }

            List<NewsResponseDTO> newsList = newsService.getTodayTopNewsList(user, difficulty, lang);

            return ApiResponse.createSuccess(newsList, "오늘의 TOP10뉴스 조회 성공");
        } catch (Exception e) {
            log.error("뉴스 TOP10 불러오기 중 실패", e);
            return ApiResponse.createError(ErrorCode.NEWS_LIST_NOT_FOUND);
        }
    }

    // 유저가 최근 본 뉴스들 조회
    @GetMapping("/recent")
    public ApiResponse<?> getRecentNews(Authentication authentication) throws Exception {
        try {
            Users user = userService.findByEmail(authentication.getName());
            if (user == null) {
                return ApiResponse.createError(ErrorCode.USER_NOT_FOUND);
            }

            List<NewsSimpleResponseDTO> newsList = newsService.getRecentNews(user);

            return ApiResponse.createSuccess(newsList, "최근 본 뉴스 목록 조회 성공");
        } catch (Exception e) {
            log.error("최근 본 뉴스 목록 불러오기 중 실패", e);
            return ApiResponse.createError(ErrorCode.NEWS_LIST_NOT_FOUND);
        }
    }

    // 뉴스 상세 조회
    @GetMapping("/detail/{newsId}")
    public ApiResponse<?> getNewsDetail(Authentication authentication,
                                        @PathVariable("newsId") long newsId,
                                        @RequestParam("difficulty") int difficulty,
                                        @RequestParam("lang") String lang,
                                        @RequestParam("isFirstView") boolean isViewed) throws Exception {
        try {
            Users user = userService.findByEmail(authentication.getName());
            if (user == null) {
                return ApiResponse.createError(ErrorCode.USER_NOT_FOUND);
            }

            NewsDetailRequestDTO newsDetailRequestDTO = NewsDetailRequestDTO.builder()
                    .difficulty(difficulty)
                    .lang(lang)
                    .isFirstView(isViewed)
                    .build();

            NewsDetailResponseDTO newsDetailResponseDTO = newsService.getNewsDetail(user, newsId, newsDetailRequestDTO);

            return ApiResponse.createSuccess(newsDetailResponseDTO, "뉴스 상세 조회 성공");
        } catch (Exception e) {
            log.error("뉴스 상세 조회 중 실패", e);
            return ApiResponse.createError(ErrorCode.NEWS_NOT_FOUND);
        }
    }


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

            newsService.readNews(user, newsReadRequestDTO); //뉴스 읽음 처리

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

            newsService.scrapNews(user, newsReadRequestDTO); //뉴스 읽음 처리

            return ApiResponse.createSuccessWithNoContent("뉴스 스크랩 처리 성공");
        } catch (Exception e) {
            log.error("뉴스 스크랩 처리 중 실패", e);
            return ApiResponse.createError(ErrorCode.NEWS_SCRAP_FAILED);
        }

    }

    // 뉴스 스크랩 취소
    @DeleteMapping("/scrap/{newsId}/{difficulty}")
    public ApiResponse<?> cancelScrapedNews(Authentication authentication,
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

            newsService.cancelScrapedNews(user, newsReadRequestDTO);

            return ApiResponse.createSuccessWithNoContent("뉴스 스크랩 취소 처리 성공");
        } catch (Exception e) {
            log.error("뉴스 스크랩 취소 처리 중 실패", e);
            return ApiResponse.createError(ErrorCode.NEWS_SCRAP_CANCEL_FAILED);
        }

    }

    @GetMapping("/search")
    public ApiResponse<?> searchNews(@RequestParam String query) throws IOException {
        // contains 방식으로 검색 수행
        try {
            List<SearchNewsDTO> dto = newsService.searchByTitleOrTitleEngContains(query);
            return ApiResponse.createSuccess(dto, "good");
        }catch(Exception e) {
            return ApiResponse.createError(ErrorCode.WORD_CREATE_FAILED);
        }
    }

    /* 추천 */

}