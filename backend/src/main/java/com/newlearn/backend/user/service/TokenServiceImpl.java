package com.newlearn.backend.user.service;

import org.springframework.stereotype.Service;

import com.newlearn.backend.user.model.TokenBlacklist;
import com.newlearn.backend.user.repository.redis.TokenBlacklistRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TokenServiceImpl implements TokenService{

	private final TokenBlacklistRepository tokenBlacklistRepository;


	@Override
	public void blacklistRefreshToken(String refreshToken) {
		tokenBlacklistRepository.save(new TokenBlacklist(refreshToken));
	}

	@Override
	public void getRefreshToken(String refreshToken) {
		if(isRefreshTokenInBlacklisted(refreshToken)) {

		}
	}

	@Override
	public boolean isRefreshTokenInBlacklisted(String refreshToken) {
		return tokenBlacklistRepository.existsById(refreshToken);
	}
}
