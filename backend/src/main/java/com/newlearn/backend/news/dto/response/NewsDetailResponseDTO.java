package com.newlearn.backend.news.dto.response;

import com.newlearn.backend.news.model.News;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

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

//    private List<WordInfo> words;
//
//    @Getter
//    @Builder
//    public static class WordInfo {
//        private String word;
//        private List<String> sentences;
//    }

    public static NewsDetailResponseDTO of(News news, String content, boolean isScrapped) {
        return NewsDetailResponseDTO.builder()
                .newsId(news.getNewsId())
                .title(news.getTitle())
                .content(content)
                .thumbnailImageUrl(news.getThumbnailImageUrl())
                .category(news.getCategory().getCategoryName())
                .publishedDate(news.getPublishedDate())
                .journalist(news.getJournalist())
                .press(news.getPress())
                .originalUrl(news.getUrl())
                .hit(news.getHit())
                .isScrapped(isScrapped)
                .build();
    }


}
