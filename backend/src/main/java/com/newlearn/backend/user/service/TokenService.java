package com.newlearn.backend.user.service;

import com.newlearn.backend.user.dto.response.RefreshTokenResponseDTO;

public interface TokenService {

	void blacklistRefreshToken(String refreshToken);

	RefreshTokenResponseDTO getRefreshToken(String refreshToken) throws Exception;

	boolean isRefreshTokenInBlacklisted(String refreshToken);
}
