package com.newlearn.backend.search.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SearchNewsDTO {

	private Long newsId;
	private String title;
	private String content;
	private String thumbnailImageUrl;
	private String category;
	private String publishedDate;
	private List<Boolean> isRead;

}
