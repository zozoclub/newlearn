package com.newlearn.backend.search.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;

import lombok.Getter;

@Getter
@Document(indexName = "news")
public class SearchNews {

	@Id
	private Long newsId;
	private String title;
	private String titleEng;
}
