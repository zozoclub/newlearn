package com.newlearn.backend.news.dto.response;

import com.newlearn.backend.news.model.News;
import com.newlearn.backend.news.model.UserNewsRead;
import com.newlearn.backend.user.model.Users;
import com.newlearn.backend.word.model.Word;
import com.newlearn.backend.word.model.WordSentence;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Builder
public class NewsDetailResponseDTO {
    private Long newsId;
    private String title;
    private String content;
    private String thumbnailImageUrl;
    private String category; //"정치", "경제", "사회", "생활/문화", "IT/과학", "세계"
    private String publishedDate;
    private String journalist;
    private String press;
    private String originalUrl;
    private Long hit;
    private Boolean isScrapped;
    private boolean[] isRead;

    private List<WordInfo> words;

    @Getter
    @AllArgsConstructor
    public static class WordInfo {
        private String word;
        private String sentence;
    }

    public static NewsDetailResponseDTO of(News news, String title, String content, boolean isScrapped, UserNewsRead userNewsRead, List<WordInfo> words) {
        return NewsDetailResponseDTO.builder()
                .newsId(news.getNewsId())
                .title(title)
                .content(content)
                .thumbnailImageUrl(news.getThumbnailImageUrl())
                .category(news.getCategory().getCategoryName())
                .publishedDate(news.getPublishedDate())
                .journalist(news.getJournalist())
                .press(news.getPress())
                .originalUrl(news.getUrl())
                .hit(news.getHit())
                .isScrapped(isScrapped)
                .isRead(userNewsRead != null ? userNewsRead.getReadStatus() : UserNewsRead.getDefaultReadStatus())
                .words(words)
                .build();
    }


}
