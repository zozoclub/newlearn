package com.newlearn.backend.study.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class WordTestResultDetailResponseDTO {

    private long newsId;
    private long questionId;
    private String answer;
    private long difficulty;
    private String correctAnswer;
    private String sentence;
    private String sentenceMeaning;
    private boolean correct;
}