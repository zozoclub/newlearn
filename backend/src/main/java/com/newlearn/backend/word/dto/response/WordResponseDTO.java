package com.newlearn.backend.word.dto.response;

import java.util.List;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class WordResponseDTO {

	private Long wordId;
	private String word;
	private String wordMeaning;
	private boolean isComplete;

	public WordResponseDTO(Long wordId, String word, String wordMeaning, boolean isComplete) {
		this.wordId = wordId;
		this.word = word;
		this.wordMeaning = wordMeaning;
		this.isComplete = isComplete;
	}

}
