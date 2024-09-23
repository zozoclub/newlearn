package com.newlearn.backend.study.dto.request;

import lombok.*;

@Getter
@Builder
public class WordTestResultDTO {
    private String answer;
    private String correctAnswer;
    private Boolean isCorrect;
    private String sentence;
}