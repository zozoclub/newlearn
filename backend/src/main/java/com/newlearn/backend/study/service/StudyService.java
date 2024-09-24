package com.newlearn.backend.study.service;


import com.newlearn.backend.study.dto.request.GoalRequestDTO;
import com.newlearn.backend.study.dto.request.WordTestResultRequestDTO;
import com.newlearn.backend.study.dto.response.*;
import com.newlearn.backend.user.model.Users;

import java.util.List;

public interface StudyService {

    boolean isGoalExist(Long userId);

    void saveGoal(Long userId, GoalRequestDTO goalRequestDTO);

    StudyProgressDTO getStudyProgress(Long userId);

    List<WordTestResponseDTO> getWordTestProblems(Long userId, Users user, Long totalCount);

    void saveWordTestResult(Long userId, WordTestResultRequestDTO wordTestResultRequestDTO);

    List<WordTestResultResponseDTO> getWordTestResults(Long userId);

    WordTestResultDetailResponseDTO getWordTestResult(Long userId, Long quizId);

    List<PronounceTestResponseDTO> getPronounceTestProblems(Long userId, Users user);

}
