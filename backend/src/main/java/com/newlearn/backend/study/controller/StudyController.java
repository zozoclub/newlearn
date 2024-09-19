package com.newlearn.backend.study.controller;

import com.newlearn.backend.common.ApiResponse;
import com.newlearn.backend.common.ErrorCode;
import com.newlearn.backend.study.dto.request.GoalRequestDTO;
import com.newlearn.backend.study.model.Goal;
import com.newlearn.backend.study.service.StudyService;
import com.newlearn.backend.user.model.Users;
import com.newlearn.backend.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

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
            Users user = userService.findByEmail(authentication.getName())
                    .orElseThrow(() -> new Exception("회원정보 없음"));

            studyService.updateGoal(user.getUserId(), goalRequestDTO);

            return ApiResponse.createSuccess(null, "학습 목표 설정 성공");
        } catch (Exception e) {
            log.error("목표 설정 중 오류 발생", e);
            return ApiResponse.createError(ErrorCode.GOAL_CREATE_FAILED);
        }
    }

    // 개인 학습 진도율 조회


    
    // 단어 테스트 문제 가져오기
    
    // 단어 테스트 결과 저장
    
    // 단어 테스트 결과 리스트 조회
    
    // 발음 테스트 예문 가져오기
    
    // 발음 테스트 결과 저장
    
    // 발음 테스트 결과 리스트 조회
    
    // 발음 테스트 결과 상세 조회

}
