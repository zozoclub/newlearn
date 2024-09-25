package com.newlearn.backend.news.dto.response;

import com.newlearn.backend.news.model.News;
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



}
