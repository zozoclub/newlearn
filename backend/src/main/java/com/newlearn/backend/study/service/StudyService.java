package com.newlearn.backend.study.service;


import com.newlearn.backend.study.dto.request.GoalRequestDTO;
import com.newlearn.backend.study.dto.response.StudyProgressDTO;

public interface StudyService {

    void updateGoal(Long userId, GoalRequestDTO goalRequestDTO);

    StudyProgressDTO getStudyProgress(Long userId);

}
