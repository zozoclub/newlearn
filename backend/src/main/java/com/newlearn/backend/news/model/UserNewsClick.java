package com.newlearn.backend.news.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Document(collection = "user_news_click")
@CompoundIndex(name = "user_news_unique", def = "{'userId': 1, 'newsId': 1}", unique = true)
public class UserNewsClick {
    @Id
    private String id;
    @Field(name = "user_id")
    private Long userId;
    @Field(name = "news_id")
    private Long newsId;
    @Field(name = "category_id")
    private Long categoryId;
    @Field(name = "created_at")
    private LocalDateTime createdAt;

    public UserNewsClick(Long userId, Long newsId, Long categoryId) {
        this.userId = userId;
        this.newsId = newsId;
        this.categoryId = categoryId;
    }
}
