package com.newlearn.backend.search.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.newlearn.backend.common.ApiResponse;
import com.newlearn.backend.common.ErrorCode;
import com.newlearn.backend.search.dto.response.SearchNewsDTO;
import com.newlearn.backend.search.model.SearchNews;
import com.newlearn.backend.search.service.SearchService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {

	//영어 한글 혼합에러처리,
	private final SearchService searchService;

	@GetMapping
	public ApiResponse<?> getTitle(@RequestParam String query) {
		try {
			List<SearchNewsDTO> result = searchService.searchByTitleOrTitleEng(query);
			if (result.isEmpty()) {
				return ApiResponse.createSuccess(result, "조회없음");
			}
			return ApiResponse.createSuccess(result, "조회성공");
		} catch (Exception e) {
			return ApiResponse.createError(ErrorCode.WORD_CREATE_FAILED);
		}
	}

	// 자동완성 검색
	@GetMapping("/auto")
	public ApiResponse<?> getAutoComplete(@RequestParam String query) {
		try {
			List<SearchNewsDTO> result = searchService.searchAutoCompleteByTitleOrTitleEng(query);
			if (result.isEmpty()) {
				return ApiResponse.createSuccess(result, "조회없음");
			}
			return ApiResponse.createSuccess(result, "조회성공");
		} catch (Exception e) {
			e.printStackTrace();
			return ApiResponse.createError(ErrorCode.WORD_CREATE_FAILED);
		}
	}

	boolean isKorean(String text) {
		return text.matches(".*[ㄱ-ㅎㅏ-ㅣ가-힣]+.*");
	}

	boolean isEnglish(String text) {
		return text.matches(".*[a-zA-Z]+.*");
	}
}
