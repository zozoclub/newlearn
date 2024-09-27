package com.newlearn.backend.rank.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ReadingRankDTO {

    private long userId;
    private String nickname;
    private long experience;
    private long totalNewsReadCount;
    private long ranking;

}
