package com.newlearn.backend.oauth.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.newlearn.backend.common.ApiResponse;
import com.newlearn.backend.common.ErrorCode;
import com.newlearn.backend.common.JwtTokenProvider;
import com.newlearn.backend.oauth.dto.response.ResponseOAuthInfoDTO;
import com.newlearn.backend.oauth.model.OAuthCodeToken;
import com.newlearn.backend.oauth.model.TempUser;
import com.newlearn.backend.oauth.repository.OAuthCodeTokenRepository;
import com.newlearn.backend.oauth.repository.TempUserRepository;
import com.newlearn.backend.user.dto.response.LoginResponseDTO;
import com.newlearn.backend.user.service.UserService;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/oauth")
@RequiredArgsConstructor
@Slf4j
public class OAuthController {

	private final JwtTokenProvider jwtTokenProvider;
	private final OAuthCodeTokenRepository oAuthCodeTokenRepository;
	private final TempUserRepository tempUserRepository;
	private final UserService userService;

	@Value("${oauth2.baseUrl}")
	private String baseUrl;

	@GetMapping("/login/{provider}")
	public ResponseEntity<Map<String, String>> getOAuthLoginUrl(@PathVariable String provider) {
		String redirectUrl = baseUrl + "/oauth2/authorization/" + provider;
		Map<String, String> response = new HashMap<>();
		response.put("url", redirectUrl);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/get-oauth-info")
	public ApiResponse<?> getOAuthInfo(@RequestParam("token") String token) {
		try {
			TempUser tempUser = tempUserRepository.findById(token)
				.orElseThrow(() -> new Exception("토큰이 유효하지 않습니다."));

			String email = tempUser.getEmail();
			String name = tempUser.getName();
			String provider = tempUser.getProvider();
			String providerId = tempUser.getProviderId();

			ResponseOAuthInfoDTO responseDTO = ResponseOAuthInfoDTO
				.builder()
				.email(email)
				.name(name)
				.provider(provider)
				.providerId(providerId)
				.build();

			return ApiResponse.createSuccess(responseDTO, "OAuth 정보 조회 성공");
		} catch (Exception e) {
			return ApiResponse.createError(ErrorCode.TEMP_USER_NOT_FOUND);
		}
	}

	@GetMapping("/get-user-token")
	public ApiResponse<?> getUserToken(@RequestParam("code") String code, HttpServletResponse response) {
		try {
			OAuthCodeToken oAuthCodeToken = oAuthCodeTokenRepository.findById(code)
				.orElseThrow(() -> new Exception("코드가 유효하지 않습니다."));

			String accessToken =oAuthCodeToken.getAccessToken();
			String refreshToken =oAuthCodeToken.getRefreshToken();

			ResponseCookie responseCookie = ResponseCookie.from("refreshToken", refreshToken)
				.httpOnly(true)
				.secure(true)
				.maxAge(60*60*24*14)
				.path("/")
				.sameSite("None")
				.domain("j11d105.p.ssafy.io")
				.build();

			response.setHeader(HttpHeaders.SET_COOKIE, responseCookie.toString());

			accessToken = "Bearer " + accessToken;
			LoginResponseDTO loginResponseDTO = new LoginResponseDTO();
			loginResponseDTO.setAccessToken(accessToken);

			return ApiResponse.createSuccess(loginResponseDTO, "토큰 발급에 성공하였습니다.");
		} catch (Exception e) {
			return ApiResponse.createError(ErrorCode.OAUTH_CODE_NOT_FOUND);
		}
	}

}
