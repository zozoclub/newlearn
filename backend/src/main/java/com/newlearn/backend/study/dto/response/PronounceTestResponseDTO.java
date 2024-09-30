package com.newlearn.backend.study.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PronounceTestResponseDTO {
	private long sentenceId;
	private String sentence;
	private String sentenceMeaning;
}