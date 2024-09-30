package com.newlearn.backend.study.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class WordTestResultResponseDTO {

    private long quizId;
    private long totalCnt;
    private long correctCnt;
    private LocalDateTime createdAt;

}
