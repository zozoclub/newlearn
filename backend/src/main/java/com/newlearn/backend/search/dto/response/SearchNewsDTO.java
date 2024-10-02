package com.newlearn.backend.search.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Data
public class SearchNewsDTO {

	private Long newsId;
	private String title;
	private String titleEng;
}
