package com.newlearn.backend.search.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.newlearn.backend.common.ApiResponse;
import com.newlearn.backend.common.ErrorCode;
import com.newlearn.backend.news.dto.response.NewsResponseDTO;
import com.newlearn.backend.search.dto.request.SearchListRequestDTO;
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
	public ApiResponse<?> getTitle(Authentication authentication, @RequestParam("difficulty") int difficulty,
		@RequestParam("query") String query,
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size) {
		try {
			Users user = userService.findByEmail(authentication.getName());
			if (user == null) {
				return ApiResponse.createError(ErrorCode.USER_NOT_FOUND);
			}

			SearchListRequestDTO searchListRequestDTO = SearchListRequestDTO.builder()
				.difficulty(difficulty)
				.query(query)
				.size(size)
				.page(page)
				.build();


			Page<NewsResponseDTO> result = searchService.searchByTitleOrTitleEng(searchListRequestDTO, user);
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

	//집계 함수 제거
	@DeleteMapping("/delete")
	public ApiResponse<?> deleteAggregateIndex() {
		System.out.println("들어오기는함");
		try {
			searchService.deleteAggregateIndex();
			return ApiResponse.createSuccess(null, "성공적으로 삭제했습니다");
		} catch (Exception e) {
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
