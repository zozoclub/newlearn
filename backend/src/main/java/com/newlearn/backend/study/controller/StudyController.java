package com.newlearn.backend.study.controller;

import com.newlearn.backend.common.ApiResponse;
import com.newlearn.backend.common.ErrorCode;
import com.newlearn.backend.study.dto.request.GoalRequestDTO;
import com.newlearn.backend.study.dto.request.PronounceRequestDTO;
import com.newlearn.backend.study.dto.request.WordTestResultRequestDTO;
import com.newlearn.backend.study.dto.response.*;
import com.newlearn.backend.study.service.StudyService;
import com.newlearn.backend.user.model.Users;
import com.newlearn.backend.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/study")
public class StudyController {

    private final UserService userService;
    private final StudyService studyService;

    // 학습 목표 설정
    @PostMapping("/goal")
    public ApiResponse<?> setStudyGoal(Authentication authentication,
        @RequestBody GoalRequestDTO goalRequestDTO) throws Exception {
        try {
            Users user = userService.findByEmail(authentication.getName());
            if (user == null) {
                return ApiResponse.createError(ErrorCode.USER_NOT_FOUND);
            }

            boolean isGoalExist = studyService.isGoalExist(user.getUserId());   // 목표가 이미 존재하면 재설정 불가
            if (isGoalExist) {
                return ApiResponse.createError(ErrorCode.GOAL_ALREADY_EXISTS);
            }

            studyService.saveGoal(user.getUserId(), goalRequestDTO);    // 새로운 목표 저장

            return ApiResponse.createSuccess(null, "학습 목표 설정 성공");
        } catch (Exception e) {
            log.error("목표 설정 중 오류 발생", e);
            return ApiResponse.createError(ErrorCode.GOAL_CREATE_FAILED);
        }
    }

    // 개인 학습 진도율 조회
    @GetMapping("/progress")
    public ApiResponse<?> getStudyProgress(Authentication authentication) throws Exception {
        try {
            Users user = userService.findByEmail(authentication.getName());
            if (user == null) {
                return ApiResponse.createError(ErrorCode.USER_NOT_FOUND);
            }

            StudyProgressDTO progress = studyService.getStudyProgress(user.getUserId());

            return ApiResponse.createSuccess(progress, "개인 진도율 조회 성공");
        } catch (Exception e) {
            log.error("진도율 조회 중 오류 발생", e);
            return ApiResponse.createError(ErrorCode.STUDY_PROGRESS_NOT_FOUND);
        }
    }

    // 단어 테스트 문제 가져오기
    @GetMapping("/word/test")
    public ApiResponse<?> getStudyWordTest(Authentication authentication, @RequestParam Long totalCount) throws Exception {
        try {
            Users user = userService.findByEmail(authentication.getName());
            if (user == null) {
                return ApiResponse.createError(ErrorCode.USER_NOT_FOUND);
            }

            WordTestResponseWithQuizIdDTO tests = studyService.getWordTestProblems(user.getUserId(), totalCount);

            return ApiResponse.createSuccess(tests, "단어 상세 조회 성공");
        } catch (Exception e) {
            log.error("단어 테스트 문제 조회 중 오류 발생", e);
            return ApiResponse.createError(ErrorCode.WORD_TEST_NOT_FOUND);
        }
    }

    // 단어 테스트 결과 저장
    @PostMapping("/word/test")
    public ApiResponse<?> setStudyWordTest(Authentication authentication,
                                           @RequestBody WordTestResultRequestDTO wordTestResultRequestDTO) throws Exception {
        try {
            Users user = userService.findByEmail(authentication.getName());
            if (user == null) {
                return ApiResponse.createError(ErrorCode.USER_NOT_FOUND);
            }

            studyService.saveWordTestResult(user, wordTestResultRequestDTO);

            return ApiResponse.createSuccess(null, "단어 테스트 저장 성공");
        } catch (Exception e) {
            log.error("단어 테스트 결과 저장 중 오류 발생", e);
            return ApiResponse.createError(ErrorCode.WORD_TEST_RESULT_CREATE_FAILED);
        }
    }
    
    // 단어 테스트 결과 리스트 조회
    @GetMapping("/word/test/result/list")
    public ApiResponse<?> getStudyWordTestResultList(Authentication authentication) throws Exception {
        try {
            Users user = userService.findByEmail(authentication.getName());
            if (user == null) {
                return ApiResponse.createError(ErrorCode.USER_NOT_FOUND);
            }

            List<WordTestResultResponseDTO> results = studyService.getWordTestResults(user.getUserId());

            return ApiResponse.createSuccess(results, "단어 테스트 결과 리스트 조회 성공");
        } catch (Exception e) {
            log.error("단어 테스트 결과 리스트 조회 중 오류 발생", e);
            return ApiResponse.createError(ErrorCode.WORD_TEST_RESULT_NOT_FOUND);
        }
    }

    // 단어 문장 빈칸 테스트 결과 상세 조회
    @GetMapping("/word/test/result/{quizId}")
    public ApiResponse<?> getStudyWordTestResult(Authentication authentication,
                                           @PathVariable Long quizId) throws Exception {
        try {
            Users user = userService.findByEmail(authentication.getName());
            if (user == null) {
                return ApiResponse.createError(ErrorCode.USER_NOT_FOUND);
            }

            WordTestResultDetailDTO result = studyService.getWordTestResult(user.getUserId(), quizId);

            return ApiResponse.createSuccess(result, "단어 테스트 결과 상세 조회 성공");
        } catch (Exception e) {
            log.error("단어 테스트 결과 상세 조회 중 오류 발생", e);
            return ApiResponse.createError(ErrorCode.WORD_TEST_NOT_FOUND);
        }
    }

    @DeleteMapping("/word/test/exit/{quizId}")
    public ApiResponse<?> exitStudyWordTest(Authentication authentication, @PathVariable Long quizId) throws Exception {
        try {
            Users user = userService.findByEmail(authentication.getName());
            if (user == null) {
                return ApiResponse.createError(ErrorCode.USER_NOT_FOUND);
            }

            System.out.println(quizId);
            studyService.exitQuiz(quizId);

            return ApiResponse.createSuccess(null, "단어 테스트 중도 퇴장 성공");
        } catch (Exception e) {
            log.error("단어 문장 빈칸 테스트 중도 퇴장 실패");
            return ApiResponse.createError(ErrorCode.WORD_TEST_EXIT_ERROR);
        }
    }
    
    // 발음 테스트 예문 가져오기
    @GetMapping("/pronounce/test")
    public ApiResponse<?> getPronounceWordTest(Authentication authentication) throws Exception {
        try {
            Users user = userService.findByEmail(authentication.getName());
            if (user == null) {
                return ApiResponse.createError(ErrorCode.USER_NOT_FOUND);
            }

            List<PronounceTestResponseDTO> tests = studyService.getPronounceTestProblems(user.getUserId());

            return ApiResponse.createSuccess(tests, "발음 테스트 예문 가져오기 성공");
        } catch (Exception e) {
            log.error("발음 테스트 문제 조회 중 오류 발생", e);
            return ApiResponse.createError(ErrorCode.PRONOUNCE_TEST_NOT_FOUND);
        }
    }

    // 발음 테스트 결과 저장
    @PostMapping(value = "/pronounce/test", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ApiResponse<?> setPronounceWordTest(Authentication authentication,
                                               @RequestParam List<Long> sentenceIds,
                                               @RequestParam("accuracyScore") long accuracyScore,
                                               @RequestParam("fluencyScore") long fluencyScore,
                                               @RequestParam("completenessScore") long completenessScore,
                                               @RequestParam("prosodyScore") long prosodyScore,
                                               @RequestParam("totalScore") long totalScore,
                                               @RequestParam("files") MultipartFile file) throws Exception {
        try {
            Users user = userService.findByEmail(authentication.getName());
            if (user == null) {
                return ApiResponse.createError(ErrorCode.USER_NOT_FOUND);
            }

            PronounceRequestDTO pronounceRequestDTO = PronounceRequestDTO.builder()
                    .accuracyScore(accuracyScore)
                    .fluencyScore(fluencyScore)
                    .completenessScore(completenessScore)
                    .prosodyScore(prosodyScore)
                    .totalScore(totalScore)
                    .build();

            // 비동기적으로 파일 업로드
            CompletableFuture<Long> fileUploadFuture = studyService.savePronounceTestResultAsync(user, pronounceRequestDTO, file, sentenceIds);

            // Future가 완료될 때까지 기다리고 audioFileId를 가져옴
            Long audioFileId = fileUploadFuture.join(); // 결과를 기다림

            // Response 객체 (DTO 안쓰고 만듬)
            Map<String, Long> data = new HashMap<>();
            data.put("audioFileId", audioFileId);

            // 즉시 성공 응답 반환
            return ApiResponse.createSuccess(data, "발음 테스트 결과 저장 성공. 파일 업로드 중입니다.");
        } catch (Exception e) {
            log.error("발음 테스트 결과 저장 중 오류 발생", e);
            return ApiResponse.createError(ErrorCode.PRONOUNCE_TEST_RESULT_UPDATE_FAILED);
        }
    }


    // 발음 테스트 결과 리스트 조회
    @GetMapping("/pronounce/list")
    public ApiResponse<?> setPronounceWordTest(Authentication authentication) throws Exception {
        try {
            Users user = userService.findByEmail(authentication.getName());
            if (user == null) {
                return ApiResponse.createError(ErrorCode.USER_NOT_FOUND);
            }

            List<PronounceTestResultResponseDTO> results = studyService.getPronounceTestResults(user.getUserId());

            return ApiResponse.createSuccess(results, "발음 테스트 결과 리스트 조회 성공");
        } catch (Exception e) {
            log.error("발음 테스트 결과 리스트 조회 중 오류 발생", e);
            return ApiResponse.createError(ErrorCode.PRONOUNCE_TEST_RESULT_NOT_FOUND);
        }
    }

    // 발음 테스트 결과 상세 조회
    @GetMapping("/pronounce/{audioFileId}")
    public ApiResponse<?> getPronounceTestDetail(Authentication authentication,
                                                 @PathVariable Long audioFileId) {
        try {
            // 사용자 정보 조회
            Users user = userService.findByEmail(authentication.getName());
            if (user == null) {
                return ApiResponse.createError(ErrorCode.USER_NOT_FOUND);
            }

            // 발음 테스트 결과 조회
            PronounceTestResultDetailResponseDTO results = studyService.getPronounceTestResult(audioFileId);
            if (results == null) {
                return ApiResponse.createError(ErrorCode.PRONOUNCE_TEST_RESULT_NOT_FOUND);
            }

            return ApiResponse.createSuccess(results, "발음 테스트 결과 상세 조회 성공");
        } catch (Exception e) {
            log.error("발음 테스트 결과 상세 조회 중 오류 발생", e);
            return ApiResponse.createError(ErrorCode.PRONOUNCE_TEST_RESULT_NOT_FOUND);
        }
    }

}

