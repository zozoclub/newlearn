package com.newlearn.backend.user.dto.response;

import com.newlearn.backend.news.dto.response.NewsResponseDTO;
import com.newlearn.backend.news.model.News;
import com.newlearn.backend.news.model.UserNewsRead;
import com.newlearn.backend.news.model.UserNewsScrap;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class UserScrapedNewsResponseDTO {
    private Long newsId;
    private String title;
    private String content;
    private String thumbnailImageUrl;
    private String category; //"정치", "경제", "사회", "생활/문화", "IT/과학", "세계"
    private String publishedDate;
    private boolean[] isRead; // 난이도 별 읽음 표시
    private Integer difficulty; //스크랩한 난이도
    private LocalDateTime scrapedDate ; //스크랩한 시간

    public static UserScrapedNewsResponseDTO makeScrapedNewsResponseDTO(UserNewsScrap scrap, UserNewsRead readStatus, String lang, int difficulty) {
        News news = scrap.getNews();

        return UserScrapedNewsResponseDTO.builder()
                .newsId(news.getNewsId())
                .title(news.getTitleByLang(lang))
                .content(news.getContentByLangAndDifficulty(lang, difficulty))
                .thumbnailImageUrl(news.getThumbnailImageUrl())
                .category(news.getCategory().getCategoryName())
                .publishedDate(news.getPublishedDate())
                .isRead(readStatus != null ? readStatus.getReadStatus() : UserNewsRead.getDefaultReadStatus())
                .difficulty(scrap.getDifficulty())
                .scrapedDate(scrap.getScrapedDate())
                .build();
    }
}
