package com.newlearn.backend.study.dto.request;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GoalRequestDTO {
    private Long goalReadNewsCount;

    private Long goalPronounceTestScore;

    private Long goalCompleteWord;

}
