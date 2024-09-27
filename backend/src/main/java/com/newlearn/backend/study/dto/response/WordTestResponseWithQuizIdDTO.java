package com.newlearn.backend.study.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class WordTestResponseWithQuizIdDTO {

    private Long quizId;
    private List<WordTestResponseDTO> tests;

}
