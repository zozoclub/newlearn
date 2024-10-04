package com.newlearn.backend.search.dto.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Data
@AllArgsConstructor
public class SearchNewsAutoDTO {

	private Long newsId;
	private String title;
	private String titleEng;


}
