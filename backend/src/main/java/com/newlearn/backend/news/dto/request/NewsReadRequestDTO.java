package com.newlearn.backend.news.dto.request;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class NewsReadRequestDTO { //뉴스 읽음, 스크랩
    private Long newsId;
    private Integer difficulty;
}
