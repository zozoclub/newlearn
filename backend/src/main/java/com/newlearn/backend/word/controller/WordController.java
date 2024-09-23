package com.newlearn.backend.word.controller;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.newlearn.backend.common.ApiResponse;
import com.newlearn.backend.common.ErrorCode;
import com.newlearn.backend.user.model.Users;
import com.newlearn.backend.user.service.UserService;
import com.newlearn.backend.word.dto.request.WordRequestDto;
import com.newlearn.backend.word.dto.response.WordResponseDTO;
import com.newlearn.backend.word.service.WordService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/word")
public class WordController {

	private final WordService wordService;
	private final UserService userService;


	//단어 추가
	@PostMapping
	public ApiResponse<?> addWord(Authentication authentication, @RequestBody WordRequestDto wordRequestDto)  {
		try {
			Users user = userService.findByEmail(authentication.getName());
			if(user == null) {
				return ApiResponse.createError(ErrorCode.USER_NOT_FOUND);
			}

			wordService.addWord(wordRequestDto, user);
			return ApiResponse.createSuccess(null, "성공적으로 단어가 저장되었습니;다");
		}
		catch (Exception e) {
			return ApiResponse.createError(ErrorCode.WORD_CREATE_FAILED);
		}
	}

	//단어 목록 조회
	@GetMapping
	public ApiResponse<?> getWords(Authentication authentication) {
		try {
			Users user = userService.findByEmail(authentication.getName());
			if(user == null) {
				return ApiResponse.createError(ErrorCode.USER_NOT_FOUND);
			}
			List<WordResponseDTO> response = wordService.getWords(user);

			return ApiResponse.createSuccess(response, "단어 목록 죄회 성공");
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	//외운 단어 목록 조
	@GetMapping("/complete")
	public ApiResponse<?> getCompleteWords(Authentication authentication) {
		try {
			Users user = userService.findByEmail(authentication.getName());
			if(user == null) {
				return ApiResponse.createError(ErrorCode.USER_NOT_FOUND);
			}
			List<WordResponseDTO> response = wordService.getWords(user);

			return ApiResponse.createSuccess(response, "단어 목록 죄회 성공");
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}
}
