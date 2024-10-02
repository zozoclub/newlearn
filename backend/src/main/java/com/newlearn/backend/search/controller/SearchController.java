package com.newlearn.backend.search.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.newlearn.backend.common.ApiResponse;
import com.newlearn.backend.common.ErrorCode;
import com.newlearn.backend.search.model.SearchNews;
import com.newlearn.backend.search.service.SearchService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {

	//영어 한글 혼합에러처리,
	private final SearchService searchService;
	//자동완성이랑 // 검색

	@GetMapping
	public ApiResponse<?> getTitle(@RequestParam String query) {
		try {
			List<SearchNews> result = new ArrayList<>();
			if(query == null || query.isEmpty()) {
				return ApiResponse.createSuccess(result, "조회없음");
			}

			// 한글과 영어가 혼합된 경우 에러 처리
			if (isKorean(query) && isEnglish(query)) {
				return ApiResponse.createSuccess(result, "영단어 혼합 불가");
			}


			return ApiResponse.createSuccess(null, "조회성공");
		} catch (Exception e) {
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
