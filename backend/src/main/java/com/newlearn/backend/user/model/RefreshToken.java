package com.newlearn.backend.user.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@AllArgsConstructor
@RedisHash(value = "refreshToken", timeToLive = 604800)
@NoArgsConstructor
public class RefreshToken {

	@Id
	private String userEmail;
	private String token;
	private long expiration;
}
