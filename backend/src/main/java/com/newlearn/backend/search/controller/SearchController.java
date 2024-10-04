package com.newlearn.backend.search.controller;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.newlearn.backend.common.ApiResponse;
import com.newlearn.backend.common.ErrorCode;
import com.newlearn.backend.search.dto.response.SearchNewsAutoDTO;
import com.newlearn.backend.search.dto.response.SearchNewsDTO;
import com.newlearn.backend.search.service.SearchService;
import com.newlearn.backend.user.model.Users;
import com.newlearn.backend.user.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {

	//영어 한글 혼합에러처리,
	private final SearchService searchService;
	private final UserService userService;

	@GetMapping
	public ApiResponse<?> getTitle(Authentication authentication, @RequestParam String query) {
		try {
			Users user = userService.findByEmail(authentication.getName());
			if (user == null) {
				return ApiResponse.createError(ErrorCode.USER_NOT_FOUND);
			}
			List<SearchNewsDTO> result = searchService.searchByTitleOrTitleEng(query, user);
			if (result.isEmpty()) {
				return ApiResponse.createSuccess(result, "조회없음");
			}
			return ApiResponse.createSuccess(result, "조회성공");
		} catch (Exception e) {
			return ApiResponse.createError(ErrorCode.SEARCH_NOT_FOUND);
		}
	}

	// 자동완성 검색
	@GetMapping("/auto")
	public ApiResponse<?> getAutoComplete(@RequestParam String query) {
		try {
			List<SearchNewsAutoDTO> result = searchService.searchAutoCompleteByTitleOrTitleEng(query);

			return ApiResponse.createSuccess(result, "조회성공");
		} catch (Exception e) {
			e.printStackTrace();
			return ApiResponse.createError(ErrorCode.SEARCH_NOT_FOUND);
		}
	}

	boolean isKorean(String text) {
		return text.matches(".*[ㄱ-ㅎㅏ-ㅣ가-힣]+.*");
	}

	boolean isEnglish(String text) {
		return text.matches(".*[a-zA-Z]+.*");
	}
}
