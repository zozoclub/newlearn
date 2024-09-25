package com.newlearn.backend.word.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RestudyWordResponseDTO {

	private Long wordId;
	private String word;
	private String wordMeaning;
	private String sentence;
	private String sentenceMeaning;
	private Long wordNowLevel;
}
