package com.newlearn.backend.study.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class StudyProgressDTO {
    private Long goalReadNewsCount;
    private Long goalPronounceTestScore;
    private Long goalCompleteWord;
    private Long currentReadNewsCount;
    private Long currentPronounceTestScore;
    private Long currentCompleteWord;
}
