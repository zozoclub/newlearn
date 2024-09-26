package com.newlearn.backend.study.dto.request;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PronounceRequestDTO {

    private long accuracyScore;
    private long fluencyScore;
    private long completenessScore;
    private long prosodyScore;
    private long totalScore;

}
