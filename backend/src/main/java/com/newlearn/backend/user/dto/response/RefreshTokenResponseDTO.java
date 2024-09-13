package com.newlearn.backend.user.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class RefreshTokenResponseDTO {

	private String accessToken;
	private String refreshToken;
}
