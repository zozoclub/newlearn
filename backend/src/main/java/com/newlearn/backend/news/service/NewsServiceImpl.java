package com.newlearn.backend.news.service;

import com.newlearn.backend.news.dto.request.AllNewsRequestDTO;
import com.newlearn.backend.news.dto.request.NewsReadRequestDTO;
import com.newlearn.backend.news.dto.response.NewsResponseDTO;
import com.newlearn.backend.news.model.News;
import com.newlearn.backend.news.model.UserDailyNewsRead;
import com.newlearn.backend.news.model.UserNewsRead;
import com.newlearn.backend.news.model.UserNewsScrap;
import com.newlearn.backend.news.repository.NewsRepository;
import com.newlearn.backend.news.repository.UserDailyNewsReadRepository;
import com.newlearn.backend.news.repository.UserNewsReadRepository;
import com.newlearn.backend.news.repository.UserNewsScrapRepository;
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
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.time.LocalDate;


@RequiredArgsConstructor
@Service
@Slf4j
public class NewsServiceImpl implements NewsService{

    private final NewsRepository newsRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final UserNewsReadRepository userNewsReadRepository;
    private final UserDailyNewsReadRepository userDailyNewsReadRepository;
    private final UserNewsScrapRepository userNewsScrapRepository;

    @Override
    public Page<NewsResponseDTO> getAllNews(Long userId, AllNewsRequestDTO newsRequestDTO) {
        // 1. NewsRepository에서 전체 뉴스 가져오기
        Page<News> allNewsList = newsRepository.findAllByOrderByNewsIdDesc(newsRequestDTO.getPageable());

        // 2. 현재 사용자의 모든 UserNewsRead 정보 가져오기
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
    public Page<NewsResponseDTO> getNewsByCategory(Long userId, AllNewsRequestDTO newsRequestDTO, long categoryId) {
        // 카테고리 존재 여부 확인
        categoryRepository.findById(categoryId)
                .orElseThrow(() -> new EntityNotFoundException("Category not found with id: " + categoryId));

        // 1. NewsRepository에서 카테고리별 뉴스 가져오기
        Page<News> newsByCategory = newsRepository.findAllByCategoryCategoryIdOrderByNewsIdDesc(categoryId, newsRequestDTO.getPageable());

        // 2. 현재 사용자의 해당 카테고리 뉴스에 대한 UserNewsRead 정보 가져오기
        List<UserNewsRead> userNewsReads = userNewsReadRepository.findAllByUserUserIdAndNewsCategoryCategoryId(userId, categoryId);
        Map<Long, UserNewsRead> userNewsReadMap = userNewsReads.stream()
                .collect(Collectors.toMap(unr -> unr.getNews().getNewsId(), Function.identity(), (existing, replacement) -> existing));

        // 3. News 엔티티를 NewsResponseDTO로 변환
        return newsByCategory.map(news -> NewsResponseDTO.makeNewsResponseDTO(news,
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

        // 뉴스 조회수 +1 -> 뉴스 상세보기 시
//        news.incrementHit();
//        newsRepository.save(news);

        // 사용자 뉴스 읽음 +1
        user.incrementNewsReadCnt();
        userRepository.save(user);

        // 사용자 뉴스 읽음 오늘 테이블 업데이트
        LocalDate today = LocalDate.now();
        UserDailyNewsRead dailyRead = userDailyNewsReadRepository.findByUserAndTodayDate(user, today)
                .orElseGet(() -> UserDailyNewsRead.createForToday(user));

        dailyRead.incrementNewsReadCount();
        userDailyNewsReadRepository.save(dailyRead);
    }

    @Override
    public void scrapNews(Long userId, NewsReadRequestDTO newsReadRequestDTO) {
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다."));

        News news = newsRepository.findById(newsReadRequestDTO.getNewsId())
                .orElseThrow(() -> new EntityNotFoundException("뉴스를 찾을 수 없습니다."));

        // 사용자의 뉴스 스크랩 처리 //

        // 해당 사용자와 뉴스, 난이도에 대한 스크랩이 이미 존재하는지 확인
        Optional<UserNewsScrap> existingScrap = userNewsScrapRepository.findByUserAndNewsAndDifficulty(
                user, news, newsReadRequestDTO.getDifficulty());

        if (existingScrap.isPresent()) {
            // 이미 같은 난이도뉴스를 스크랩한 경우 예외 처리
            throw new IllegalStateException("이미 같은 난이도로 스크랩한 뉴스입니다.");
        } else {
            // 새로운 스크랩 생성
            UserNewsScrap userNewsScrap = UserNewsScrap.builder()
                    .user(user)
                    .news(news)
                    .difficulty(newsReadRequestDTO.getDifficulty())
                    .build();

            userNewsScrapRepository.save(userNewsScrap);

            // 사용자 스크랩수 +1
            user.incrementScrapCount();
            userRepository.save(user);
        }

    }
}
