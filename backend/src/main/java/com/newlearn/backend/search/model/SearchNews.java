package com.newlearn.backend.search.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;

@Getter
@Document(indexName = "news")
@JsonIgnoreProperties(ignoreUnknown = true)
public class SearchNews {

	@Id
	@JsonProperty("news_id")
	private Long newsId;

	@JsonProperty("title")
	private String title;

	@JsonProperty("title_eng")
	private String titleEng;

}
