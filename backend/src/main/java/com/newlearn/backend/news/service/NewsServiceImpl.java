package com.newlearn.backend.news.service;

import com.newlearn.backend.news.dto.request.AllNewsRequestDTO;
import com.newlearn.backend.news.dto.request.NewsReadRequestDTO;
import com.newlearn.backend.news.dto.response.NewsResponseDTO;
import com.newlearn.backend.news.model.News;
import com.newlearn.backend.news.model.UserNewsRead;
import com.newlearn.backend.news.repository.NewsRepository;
import com.newlearn.backend.news.repository.UserNewsReadRepository;
import com.newlearn.backend.user.model.Users;
import com.newlearn.backend.user.repository.CategoryRepository;
import com.newlearn.backend.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Service
@Slf4j
public class NewsServiceImpl implements NewsService{

    private final NewsRepository newsRepository;
    private final UserRepository userRepository;
    private final UserNewsReadRepository userNewsReadRepository;

    @Override
    public Page<NewsResponseDTO> getAllNews(AllNewsRequestDTO newsRequestDTO) {

        Pageable pageable = PageRequest.of(newsRequestDTO.getPage(), newsRequestDTO.getSize());
        // 1. NewsRepository에서 전체 뉴스 가져오기
        Page<News> allNewsList = newsRepository.findAllByOrderByNewsIdDesc(pageable);

        // 2. 요청 lang & difficulty 에 따른 컬럼명 지정
        // lang & difficulty 에 따른 content_{translation/korean}_{low_medium_high} => content
        // News의 category_id 에 따라 categoryName찾아서 => category
        String contentColName = determineContentColumnName(newsRequestDTO.getLang(), newsRequestDTO.getDifficulty());

        // 3. 응답 DTO 리스트 만들기
        return allNewsList.map(news -> convertToDTO(news, contentColName));
    }

    @Override
    public void readNews(Long userId, NewsReadRequestDTO newsReadRequestDTO) {
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다."));

        News news = newsRepository.findById(newsReadRequestDTO.getNewsId())
                .orElseThrow(() -> new EntityNotFoundException("뉴스를 찾을 수 없습니다."));

        // 유저의 뉴스 읽음 처리
        UserNewsRead userNewsRead = userNewsReadRepository.findByUserAndNews(user, news)
                .orElseGet(() -> UserNewsRead.builder()
                        .user(user)
                        .news(news)
                        .categoryId(news.getCategory().getCategoryId())
                        .build());

        userNewsRead.markAsRead(newsReadRequestDTO.getDifficulty());
        userNewsReadRepository.save(userNewsRead);

        // 뉴스 조회수 +1
        news.incrementHit();
        newsRepository.save(news);

    }

    // 요청 lang & difficulty 에 따른 컬럼명 지정
    private String determineContentColumnName(String lang, int difficulty) {
        String language = lang.equals("en") ? "Translation" : "Korean";
        String difficultyLevel;
        switch (difficulty) {
            case 1:
                difficultyLevel = "Low";
                break;
            case 2:
                difficultyLevel = "Medium";
                break;
            default:
                difficultyLevel = "High";
        }
        return "content" + language + difficultyLevel;
    }

    private NewsResponseDTO convertToDTO(News news, String contentColName) {
        return NewsResponseDTO.builder()
                .newsId(news.getNewsId())
                .title(news.getTitle())
                .content(news.getNewsContent(contentColName))
                .thumbnailImageUrl(news.getThumbnailImageUrl())
                .category(news.getCategory().getCategoryName())
                .publishedDate(news.getPublishedDate())
                .build();
    }
}
