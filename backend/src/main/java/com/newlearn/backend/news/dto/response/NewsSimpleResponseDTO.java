package com.newlearn.backend.news.dto.response;

import com.newlearn.backend.news.model.News;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class NewsSimpleResponseDTO {
    private Long newsId;
    private String titleEn;
    private String titleKr;
    private String contentEn;
    private String contentKr;
    private String thumbnailImageUrl;
    private String category; //"정치", "경제", "사회", "생활/문화", "IT/과학", "세계"
    private String publishedDate;


    public static NewsSimpleResponseDTO makeNewsSimpleResponseDTO(News news) {
        return NewsSimpleResponseDTO.builder()
                .newsId(news.getNewsId())
                .titleEn(news.getTitleEng())
                .titleKr(news.getTitle())
                .contentEn(news.getContentTranslationMedium())
                .contentKr(news.getContentKoreanMedium())
                .thumbnailImageUrl(news.getThumbnailImageUrl())
                .category(news.getCategory().getCategoryName())
                .publishedDate(news.getPublishedDate())
                .build();
    }


}
