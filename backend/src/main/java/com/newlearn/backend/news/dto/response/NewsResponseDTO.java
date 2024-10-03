package com.newlearn.backend.news.dto.response;

import com.newlearn.backend.news.model.News;
import com.newlearn.backend.news.model.UserNewsRead;
import lombok.Builder;
import lombok.Getter;
import org.springframework.data.domain.Page;

@Getter
@Builder
public class NewsResponseDTO {
    private Long newsId;
    private String title;
    private String content;
    private String thumbnailImageUrl;
    private String category; //"정치", "경제", "사회", "생활/문화", "IT/과학", "세계"
    private String publishedDate;
    private boolean[] isRead; // 난이도 별 읽음 표시


    public static NewsResponseDTO makeNewsResponseDTO(News news, String lang, int difficulty, UserNewsRead userNewsRead) {
        return NewsResponseDTO.builder()
                .newsId(news.getNewsId())
                .title(news.getTitleByLang(lang))
                .content(news.getContentByLangAndDifficulty(lang, difficulty))
                .thumbnailImageUrl(news.getThumbnailImageUrl())
                .category(news.getCategory().getCategoryName())
                .publishedDate(news.getPublishedDate())
                .isRead(userNewsRead != null ? userNewsRead.getReadStatus() : UserNewsRead.getDefaultReadStatus())
                .build();
    }

}
