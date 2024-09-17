package com.newlearn.backend.user.dto.request;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UpdateAvatarDTO {

	private Long skin;
	private Long eyes;
	private Long mask;

}
