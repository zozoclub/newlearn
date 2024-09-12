package com.newlearn.backend.oauth.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ResponseOAuthInfoDTO {

	private String email;
	private String name;
	private String provider;
	private String providerId;
}
