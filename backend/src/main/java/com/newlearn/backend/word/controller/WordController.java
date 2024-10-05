package com.newlearn.backend.word.controller;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.newlearn.backend.common.ApiResponse;
import com.newlearn.backend.common.ErrorCode;
import com.newlearn.backend.user.model.Users;
import com.newlearn.backend.user.service.UserService;
import com.newlearn.backend.word.dto.request.RestudyResultRequestDTO;
import com.newlearn.backend.word.dto.request.WordRequestDto;
import com.newlearn.backend.word.dto.response.RestudyWordResponseDTO;
import com.newlearn.backend.word.dto.response.WordDetailResponseDTO;
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
			Long wordId = wordService.addWord(wordRequestDto, user);
			return ApiResponse.createSuccess(wordId, "성공적으로 단어가 저장되었습니;다");
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
			return ApiResponse.createError(ErrorCode.WORD_FIND_FAILED);
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
			List<WordResponseDTO> response = wordService.getCompleteWords(user);

			return ApiResponse.createSuccess(response, "단어 목록 죄회 성공");
		} catch (Exception e) {
			return ApiResponse.createError(ErrorCode.WORD_FIND_FAILED);
		}
	}

	//단어 삭제
	@DeleteMapping("/{wordId}")
	public ApiResponse<?> deleteWord(Authentication authentication, @PathVariable Long wordId) {

		try {
			Users user = userService.findByEmail(authentication.getName());
			if(user == null) {
				return ApiResponse.createError(ErrorCode.USER_NOT_FOUND);
			}
			wordService.deleteWord(wordId);
			return ApiResponse.createSuccess(null, "성공적 삭제");
		} catch (Exception e) {
			return ApiResponse.createError(ErrorCode.WORD_DELETE_FAILED);
		}
	}

	//단어 상세조회
	@GetMapping("/{word}")
	public ApiResponse<?> getWord(Authentication authentication, @PathVariable String word) {

		try {
			Users user = userService.findByEmail(authentication.getName());
			if(user == null) {
				return ApiResponse.createError(ErrorCode.USER_NOT_FOUND);
			}
			WordDetailResponseDTO responseDTO = wordService.getWordDetail(word, user);
			return ApiResponse.createSuccess(responseDTO, "성공적으로 상세 조회 완료");
		}catch (Exception e) {
			return ApiResponse.createError(ErrorCode.WORD_FIND_FAILED);
		}
	}

	//단어 외움처리
	@PostMapping("/{wordId}/complete")
	public ApiResponse<?> completeWord(Authentication authentication, @PathVariable Long wordId) {
		try {
			Users user = userService.findByEmail(authentication.getName());
			if(user == null) {
				return ApiResponse.createError(ErrorCode.USER_NOT_FOUND);
			}
			wordService.completeWord(wordId, user);
			return ApiResponse.createSuccess(null, "성공적으로 단어 완료 하였슴다");
		} catch (Exception e) {
			return ApiResponse.createError(ErrorCode.WORD_FIND_FAILED);
		}
	}

	//로그인하면 오늘의 망각곡선 단어들 가져오기
	@GetMapping("/restudy/check")
	public ApiResponse<?> getRestudyWords(Authentication authentication) {
		try {
			Users user = userService.findByEmail(authentication.getName());
			if(user == null) {
				return ApiResponse.createError(ErrorCode.USER_NOT_FOUND);
			}
			List<RestudyWordResponseDTO> response = wordService.getWordsForRestudy(user);

			return ApiResponse.createSuccess(response, "성공적 조회");
		}
		catch (Exception e) {
			return ApiResponse.createError(ErrorCode.WORD_FIND_FAILED);
		}
	}

	//망각곡선 진짜 안나오게 하기
	@PostMapping("/restudy/complete/{wordId}")
	public ApiResponse<?> completeRestudyWord(Authentication authentication, @PathVariable Long wordId) {
		try {
			Users user = userService.findByEmail(authentication.getName());
			if(user == null) {
				return ApiResponse.createError(ErrorCode.USER_NOT_FOUND);
			}
			wordService.finalCompleteRestudy(wordId);
			return ApiResponse.createSuccess(null, "성공적 변경");

		} catch (Exception e) {
			return ApiResponse.createError(ErrorCode.RESTUDY_UPDATE_FAILED);
		}
	}

	//망각곡선 내일로 미루기
	@PostMapping("/restudy/skip/{wordId}")
	public ApiResponse<?> skipRestudyWord(Authentication authentication, @PathVariable Long wordId) {
		try {
			Users user = userService.findByEmail(authentication.getName());
			if(user == null) {
				return ApiResponse.createError(ErrorCode.USER_NOT_FOUND);
			}
			wordService.skipRestudy(wordId);
			return ApiResponse.createSuccess(null, "성공적 변경");

		} catch (Exception e) {
			return ApiResponse.createError(ErrorCode.RESTUDY_UPDATE_FAILED);
		}
	}

	//망각곡선 모달창 결과 저장 및 닫기
	@PostMapping("/restudy/exit")
	public ApiResponse<?> exitRestudyWord(Authentication authentication, @RequestBody List<RestudyResultRequestDTO> results) {

		try {
			Users user = userService.findByEmail(authentication.getName());
			if(user == null) {
				return ApiResponse.createError(ErrorCode.USER_NOT_FOUND);
			}
			wordService.exitAndSaveResult(results);
			return ApiResponse.createSuccess(null, "단어 처리 성공");

		} catch (Exception e) {
			return ApiResponse.createError(ErrorCode.RESTUDY_UPDATE_FAILED);
		}
	}
}
