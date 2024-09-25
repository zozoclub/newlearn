package com.newlearn.backend.news.dto.request;

import com.newlearn.backend.news.model.News;
import lombok.Builder;
import lombok.Getter;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@Getter
@Builder
public class AllNewsRequestDTO {
    private Integer difficulty;
    private String lang;
    private Integer page;
    private Integer size;

    public Pageable getPageable() {
        return PageRequest.of(this.page, this.size);
    }

    public String getContentColumnName() {
        return News.determineContentColumnName(this.lang, this.difficulty);
    }
}
