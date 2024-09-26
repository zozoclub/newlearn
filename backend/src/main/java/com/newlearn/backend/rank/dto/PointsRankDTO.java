package com.newlearn.backend.rank.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PointsRankDTO {

    private long userId;
    private String nickname;
    private long experience;
    private long ranking;

}
