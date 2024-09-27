package com.newlearn.backend.news.dto.request;

import com.newlearn.backend.news.model.News;
import lombok.Builder;
import lombok.Getter;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@Getter
@Builder
public class NewsListRequestDTO { //전체 뉴스, 카테고리 뉴스 조회
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
