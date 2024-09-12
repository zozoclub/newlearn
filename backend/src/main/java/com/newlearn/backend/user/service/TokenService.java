package com.newlearn.backend.user.service;

public interface TokenService {

	void blacklistRefreshToken(String refreshToken);

}
