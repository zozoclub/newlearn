package com.newlearn.backend.study.service;


import com.newlearn.backend.study.dto.request.GoalRequestDTO;

public interface StudyService {

    void updateGoal(Long userId, GoalRequestDTO goalRequestDTO);

}
