package com.newlearn.backend.study.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class WordTestResultDetailResponseDTO {

    private long questionId;
    private String answer;
    private String correctAnswer;
    private boolean correct;
    private String sentence;
    private LocalDateTime createdAt;
}