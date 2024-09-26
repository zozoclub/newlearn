package com.newlearn.backend.study.service;

import com.newlearn.backend.study.dto.request.GoalRequestDTO;
import com.newlearn.backend.study.dto.request.PronounceRequestDTO;
import com.newlearn.backend.study.dto.request.WordTestResultRequestDTO;
import com.newlearn.backend.study.dto.response.*;
import com.newlearn.backend.user.model.Users;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface StudyService {

    boolean isGoalExist(Long userId);

    void saveGoal(Long userId, GoalRequestDTO goalRequestDTO);

    StudyProgressDTO getStudyProgress(Long userId);

    List<WordTestResponseDTO> getWordTestProblems(Long userId, Long totalCount);

    void saveWordTestResult(Long userId, WordTestResultRequestDTO wordTestResultRequestDTO);

    List<WordTestResultResponseDTO> getWordTestResults(Long userId);

    WordTestResultDetailResponseDTO getWordTestResult(Long userId, Long quizId);

    List<PronounceTestResponseDTO> getPronounceTestProblems(Long userId);

    CompletableFuture<Long> savePronounceTestResultAsync(Long userId, PronounceRequestDTO pronounceRequestDTO, MultipartFile file, List<Long> sentenceIds);

    List<PronounceTestResultResponseDTO> getPronounceTestResults(Long userId);

    PronounceTestResultDetailResponseDTO getPronounceTestResult(Long audioFileId);


}