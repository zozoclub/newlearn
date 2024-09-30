package com.newlearn.backend.word.dto.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class WordDetailResponseDTO {

	private String word;
	private String wordMeaning;
	private List<SentenceResponseDTO> sentences;


	@Data
	@AllArgsConstructor
	public static class SentenceResponseDTO {

		private Long newsId;
		private Long difficulty;
		private String sentence;
		private String sentenceMeaning;
	}
}
