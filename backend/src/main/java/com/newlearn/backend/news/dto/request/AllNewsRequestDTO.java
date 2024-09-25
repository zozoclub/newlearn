package com.newlearn.backend.news.dto.request;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AllNewsRequestDTO {
    private Integer difficulty;
    private String lang;
    private Integer page;
    private Integer size;
}
