package com.newlearn.backend.news.dto.request;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class NewsReadRequestDTO {
    private Long newsId;
    private Integer difficulty;
}
