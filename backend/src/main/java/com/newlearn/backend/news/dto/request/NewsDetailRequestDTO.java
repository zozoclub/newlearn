package com.newlearn.backend.news.dto.request;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class NewsDetailRequestDTO {
    private Integer difficulty;
    private String lang;
    private Boolean isFirstView;
}
