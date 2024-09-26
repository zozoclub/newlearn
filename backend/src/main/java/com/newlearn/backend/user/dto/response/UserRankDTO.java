package com.newlearn.backend.user.dto.response;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Setter
public class UserRankDTO {
    private Long userId;
    private String nickname;
    private Long experience;
    private Long rankValue;
}
