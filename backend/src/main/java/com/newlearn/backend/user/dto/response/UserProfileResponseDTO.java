package com.newlearn.backend.user.dto.response;

import java.util.List;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserProfileResponseDTO {

	private Long userId;
	private String email;
	private String nickname;
	private Long rank;
	private Long difficulty;
	private List<Integer> interestes;
	private Long experience;
	private Long totalNewsReadCount;
	private Long unCompleteWordCount;
	private Long completeWordCount;
	private Long scrapCount;

	private Long skin;
	private Long eye;
	private Long mask;
}
