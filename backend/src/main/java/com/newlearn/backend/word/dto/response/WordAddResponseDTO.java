package com.newlearn.backend.word.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class WordAddResponseDTO {

	private Long wordId;
	private boolean isDeleted;
}
