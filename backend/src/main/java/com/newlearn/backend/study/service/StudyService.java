package com.newlearn.backend.study.service;


import com.newlearn.backend.study.dto.request.GoalRequestDTO;
import com.newlearn.backend.study.dto.request.WordTestResultDTO;
import com.newlearn.backend.study.dto.response.StudyProgressDTO;
import com.newlearn.backend.study.dto.response.WordTestResponseDTO;
import com.newlearn.backend.user.model.Users;

import java.util.List;

public interface StudyService {

    void saveGoal(Long userId, GoalRequestDTO goalRequestDTO);

    StudyProgressDTO getStudyProgress(Long userId);

    List<WordTestResponseDTO> getWordTestProblems(Users user, Long totalCount);

//    void saveWordTestResults(Long userId, List<WordTestResultDTO> wordTestResults);

}
