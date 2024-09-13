package com.newlearn.backend.user.dto.response;

import java.util.List;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserProfileResponseDTO {

	private long userId;
	private String email;
	private String nickname;
	private long rank;
	private long difficulty;
	private List<Integer> interestes;
	private long experience;
	private long totalNewsReadCount;
	private long unCompleteWordCount;
	private long completeWordCount;
	private long scrapCount;

	private long skin;
	private long eye;
	private long mask;
}
