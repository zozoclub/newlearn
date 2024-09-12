package com.newlearn.backend.user.dto.request;

import com.newlearn.backend.user.model.Avatar;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AvatarUpdateDTO {

	private Long skin;
	private Long eyes;
	private Long mask;

}
