package com.newlearn.backend.study.dto.request;

import lombok.Builder;
import lombok.Getter;
import java.util.List;

@Getter
@Builder
public class WordTestResultRequestDTO {

    private Long quizId;
    private List<WordTestDetail> results;

    @Getter
    @Builder
    public static class WordTestDetail {
        private String sentence;
        private String correctAnswer;
        private String answer;
        private boolean isCorrect;
    }
}
