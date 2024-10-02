package com.newlearn.backend.news.dto.response;

import com.newlearn.backend.news.model.News;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class NewsSimpleResponseDTO {
    private Long newsId;
    private String title;
    private String content;
    private String thumbnailImageUrl;
    private String category; //"정치", "경제", "사회", "생활/문화", "IT/과학", "세계"
    private String publishedDate;


    public static NewsSimpleResponseDTO makeNewsSimpleResponseDTO(News news, String lang, int difficulty) {
        return NewsSimpleResponseDTO.builder()
                .newsId(news.getNewsId())
                .title(news.getTitleByLang(lang))
                .content(news.getContentByLangAndDifficulty(lang, difficulty))
                .thumbnailImageUrl(news.getThumbnailImageUrl())
                .category(news.getCategory().getCategoryName())
                .publishedDate(news.getPublishedDate())
                .build();
    }


}
