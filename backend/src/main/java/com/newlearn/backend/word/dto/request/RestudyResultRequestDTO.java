package com.newlearn.backend.word.dto.request;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RestudyResultRequestDTO {

	private Long wordId;
	private boolean isDoing;
	private boolean isCorrect;
}
