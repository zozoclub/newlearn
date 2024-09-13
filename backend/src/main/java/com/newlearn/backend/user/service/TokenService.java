package com.newlearn.backend.user.service;

public interface TokenService {

	void blacklistRefreshToken(String refreshToken);

	void getRefreshToken(String refreshToken);

	boolean isRefreshTokenInBlacklisted(String refreshToken);
}
