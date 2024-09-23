package com.newlearn.backend.user.service;

import org.springframework.stereotype.Service;

import com.newlearn.backend.common.JwtTokenProvider;
import com.newlearn.backend.user.dto.response.RefreshTokenResponseDTO;
import com.newlearn.backend.user.model.RefreshToken;
import com.newlearn.backend.user.model.TokenBlacklist;
import com.newlearn.backend.user.repository.redis.RefreshTokenRepository;
import com.newlearn.backend.user.repository.redis.TokenBlacklistRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TokenServiceImpl implements TokenService{

	private final TokenBlacklistRepository tokenBlacklistRepository;
	private final JwtTokenProvider jwtTokenProvider;
	private final RefreshTokenRepository refreshTokenRepository;

	@Override
	public void blacklistRefreshToken(String refreshToken) {
		tokenBlacklistRepository.save(new TokenBlacklist(refreshToken));
	}

	@Override
	public RefreshTokenResponseDTO getRefreshToken(String refreshToken) throws Exception {
		if(isRefreshTokenInBlacklisted(refreshToken)) {
			return null;
		}

		if(jwtTokenProvider.validateToken(refreshToken)) {
			String userEmail = jwtTokenProvider.getClaims(refreshToken).get("userEmail", String.class);

			RefreshToken storedToken = refreshTokenRepository.findById(userEmail)
				.orElseThrow(() -> new Exception("리프레시 토큰 만료되거나 없습니다."));

			if(storedToken.getToken().equals(refreshToken)) {
				refreshTokenRepository.deleteById(userEmail);

				String newAccessToken = jwtTokenProvider.generateAccessToken(userEmail);
				String newRefreshToken = jwtTokenProvider.generateRefreshToken(userEmail);

				RefreshToken nrt = RefreshToken.builder()
					.userEmail(userEmail)
					.token(newRefreshToken)
					.expiration(jwtTokenProvider.getRefreshTokenExpiration())
					.build();

				refreshTokenRepository.save(nrt);

				return new RefreshTokenResponseDTO(newAccessToken, newRefreshToken);
			}
		}
		return null;
	}

	@Override
	public boolean isRefreshTokenInBlacklisted(String refreshToken) {
		return tokenBlacklistRepository.existsById(refreshToken);
	}
}
