package com.newlearn.backend.user.dto.response;

import com.newlearn.backend.user.model.Avatar;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AvatarResponseDTO {

	private Long skin;
	private Long eyes;
	private Long mask;

	public AvatarResponseDTO(Avatar avatar) {
		this.skin = avatar.getSkin();
		this.eyes = avatar.getEyes();
		this.mask = avatar.getMask();
	}
}
