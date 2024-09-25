package com.newlearn.backend.news.model;

import com.newlearn.backend.user.model.Category;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

@Data
@Entity
@Builder
@Table(name = "news")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class News {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "news_id")
    private Long newsId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(name = "title")
    private String title;

    @Column(name = "content")
    private String content;

    @Column(name = "translated_high")
    private String contentTranslationHigh;

    @Column(name = "translated_medium")
    private String contentTranslationMedium;

    @Column(name = "translated_low")
    private String contentTranslationLow;

    @Column(name = "translated_high_kor")
    private String contentKoreanHigh;

    @Column(name = "translated_medium_kor")
    private String contentKoreanMedium;

    @Column(name = "translated_low_kor")
    private String contentKoreanLow;

    @Column(name = "published_date")
    private String publishedDate;

    @Column(name = "thumbnail_image_url")
    private String thumbnailImageUrl;

    @Column(name = "hit", nullable = false)
    @ColumnDefault("0")
    private Long hit = 0L;

    @Column(name = "journalist")
    private String journalist;

    @Column(name = "url")
    private String url;

    public String getNewsContent(String contentColName) {
        switch (contentColName) {
            case "contentKoreanHigh":
                return this.contentKoreanHigh;
            case "contentKoreanMedium":
                return this.contentKoreanMedium;
            case "contentKoreanLow":
                return this.contentKoreanLow;
            case "contentTranslationHigh":
                return this.contentTranslationHigh;
            case "contentTranslationMedium":
                return this.contentTranslationMedium;
            case "contentTranslationLow":
                return this.contentTranslationLow;
            default:
                throw new IllegalArgumentException("Invalid content column name: " + contentColName);
        }
    }

}
