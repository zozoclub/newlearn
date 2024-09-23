package com.newlearn.backend.study.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class WordTestResultResponseDTO {

    private long quizId;
    private String answer;
    private String totalCnt;
    private boolean correctCnt;
    private LocalDateTime createAt;

}
