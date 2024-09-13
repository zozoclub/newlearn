package com.newlearn.backend.config;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import com.newlearn.backend.common.JwtTokenProvider;
import com.newlearn.backend.oauth.model.OAuthCodeToken;
import com.newlearn.backend.oauth.repository.OAuthCodeTokenRepository;
import com.newlearn.backend.user.model.Users;
import com.newlearn.backend.user.repository.UserRepository;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

	private final JwtTokenProvider jwtTokenProvider;
	private final OAuthCodeTokenRepository oAuthCodeTokenRepository;
	private final UserRepository userRepository;

	@Value("${frontend.url}")
	private String frontendUrl;

	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
		Authentication authentication) throws IOException, ServletException {

		String targetUrl = null;
		String providerType = determineProviderType(request);
		OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

		if (oAuth2User.getAttribute("tempToken") != null) {
			// 임시 토큰이 존재하는 경우 := 새로운 사용자인 경우
			String tempToken = oAuth2User.getAttribute("tempToken");
			targetUrl = UriComponentsBuilder.fromUriString(frontendUrl + "/user/signup/information")
				.queryParam("token", tempToken)
				.build().toUriString();
		} else {
			// 사용자가 이미 존재하는 경우
			String email = extractEmail(oAuth2User, providerType);
			Optional<Users> userOptional = userRepository.findByEmail(email);

			if (userOptional.isPresent()) {
				Users user = userOptional.get();

				String tempCode = UUID.randomUUID().toString();
				String accessToken = jwtTokenProvider.generateAccessToken(user.getEmail());
				String refreshToken = jwtTokenProvider.generateRefreshToken(user.getEmail());

				OAuthCodeToken oAuthCodeToken = OAuthCodeToken.builder()
					.code(tempCode)
					.accessToken(accessToken)
					.refreshToken(refreshToken)
					.userEmail(email)
					.build();
				oAuthCodeTokenRepository.save(oAuthCodeToken);

				targetUrl = UriComponentsBuilder.fromUriString(frontendUrl)
					.queryParam("code", tempCode)
					.build().toUriString();
			}
		}
		getRedirectStrategy().sendRedirect(request, response, targetUrl);
	}

	private String determineProviderType(HttpServletRequest request) {
		String requestUrl = request.getRequestURI();
		if (requestUrl.contains("/login/oauth2/code/")) {
			String[] parts = requestUrl.split("/");
			return parts[parts.length - 1];
		}
		throw new OAuth2AuthenticationException("Provider Type을 찾을 수 없습니다.");
	}

	private String extractEmail(OAuth2User oAuth2User, String providerType) {
		Map<String, Object> attributes = oAuth2User.getAttributes();
		if(providerType.equals("kakao")) {
			Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
			return (String) kakaoAccount.get("email");
		} else if (providerType.equals("naver")) {
			Map<String, Object> response = (Map<String, Object>) attributes.get("response");
			return (String) response.get("email");
		} else {
			return null;
		}
	}
}
