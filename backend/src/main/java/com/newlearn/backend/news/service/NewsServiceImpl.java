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
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
@Slf4j
public class NewsServiceImpl implements NewsService{

    private final NewsRepository newsRepository;
    private final UserRepository userRepository;
    private final UserNewsReadRepository userNewsReadRepository;

    @Override
    public Page<NewsResponseDTO> getAllNews(Long userId, AllNewsRequestDTO newsRequestDTO) {
        // 1. NewsRepository에서 전체 뉴스 가져오기
        Page<News> allNewsList = newsRepository.findAllByOrderByNewsIdDesc(newsRequestDTO.getPageable());

        // 2. 현재 사용자의 모든 UserNewsRead 정보를 가져오기
        List<UserNewsRead> userNewsReads = userNewsReadRepository.findAllByUserUserId(userId);
        Map<Long, UserNewsRead> userNewsReadMap = userNewsReads.stream()
                .collect(Collectors.toMap(unr -> unr.getNews().getNewsId(), Function.identity()));

        // 3. News 엔티티를 NewsResponseDTO로 변환
        return allNewsList.map(news -> NewsResponseDTO.makeNewsResponseDTO(news,
                newsRequestDTO.getLang(),
                newsRequestDTO.getDifficulty(),
                userNewsReadMap.get(news.getNewsId())));
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

        // 사용자 뉴스 읽음 +1
        user.incrementNewsReadCnt();
        userRepository.save(user);

    }

}
