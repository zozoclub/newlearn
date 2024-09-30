package com.newlearn.backend.study.dto.response;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class PronounceTestResultDetailResponseDTO {

    private Long audioFileId;
    private String audioFileUrl;
    private Long accuracyScore;
    private Long fluencyScore;
    private Long completenessScore;
    private Long prosodyScore;
    private Long totalScore;
    private LocalDateTime createdAt;
    private List<TestSentenceDTO> tests;

    @Getter
    @Builder
    public static class TestSentenceDTO {
        private String sentence;
        private String sentenceMeaning;
    }
}
