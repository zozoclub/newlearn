package com.newlearn.backend.search.dto.request;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import com.newlearn.backend.news.model.News;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Builder
@Setter
public class SearchListRequestDTO {

	private Integer difficulty;
	private String lang;
	private Integer page;
	private Integer size;
	private String query;

	public Pageable getPageable() {
		return PageRequest.of(this.page, this.size);
	}

	public String getContentColumnName() {
		return News.determineContentColumnName(this.lang, this.difficulty);
	}
}
