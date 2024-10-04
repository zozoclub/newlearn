package com.newlearn.backend.config;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.OAuth2AuthorizationSuccessHandler;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import com.newlearn.backend.common.JwtTokenProvider;
import com.newlearn.backend.filter.JwtAuthenticationFilter;
import com.newlearn.backend.oauth.service.CustomOAuth2UserService;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

	private final JwtTokenProvider jwtTokenProvider;
	private final CustomOAuth2UserService customOAuth2UserService;
	private final OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler;

	@Value("${cors.allowed-origin}")
	private String[] allwoedOrigins;

	@Value("${cors.allowed-methods}")
	private String[] allowedMethods;

	@Bean
	SecurityFilterChain defaultSecurityFilterChain(HttpSecurity http) throws Exception {
		http.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
			.cors(cors -> cors.configurationSource(request -> {
				CorsConfiguration config = new CorsConfiguration();
				config.setAllowedOrigins(Arrays.asList(allwoedOrigins));
				config.setAllowedMethods(Arrays.asList(allowedMethods));
				config.setAllowCredentials(true);
				config.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
				config.setExposedHeaders(List.of("Authorization"));
				config.setMaxAge(3600L);
				return config;
			}))
			.csrf(AbstractHttpConfigurer::disable)
			.addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider), UsernamePasswordAuthenticationFilter.class)
			.authorizeHttpRequests(requests -> requests
				.requestMatchers("/api/oauth/**", "/api/user/sign-up", "/api/user/logout", "/api/user/check/**", "/api/user/refresh-token", "/api/rank/**", "/api/proxy", "/api/search/**", "/api/news/search").permitAll()
				.anyRequest().authenticated())
			.oauth2Login(oauth2 -> oauth2
				.userInfoEndpoint(userInfo -> userInfo.userService(customOAuth2UserService))
				.successHandler(oAuth2AuthenticationSuccessHandler)
			)
			.exceptionHandling(exception -> exception
				.authenticationEntryPoint(new CustomAuthenticationEntryPoint())
				.accessDeniedHandler(new CustomAccessDeniedHandler())
			)
			.formLogin(AbstractHttpConfigurer::disable);

		return http.build();
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

}
