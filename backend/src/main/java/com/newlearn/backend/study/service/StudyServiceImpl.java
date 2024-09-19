package com.newlearn.backend.study.service;

import com.newlearn.backend.study.dto.request.GoalRequestDTO;
import com.newlearn.backend.study.dto.response.StudyProgressDTO;
import com.newlearn.backend.study.model.Goal;
import com.newlearn.backend.study.repository.StudyRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
@Slf4j
public class StudyServiceImpl implements StudyService{

    private final StudyRepository studyRepository;

    @Override
    public void updateGoal(Long userId, GoalRequestDTO goalRequestDTO) {
        Goal goal = studyRepository.findByUserId(userId).orElseThrow(() -> new EntityNotFoundException("Goal not found"));
        goal.setGoalReadNewsCount(goalRequestDTO.getGoalReadNewsCount());
        goal.setGoalPronounceTestScore(goalRequestDTO.getGoalPronounceTestScore());
        goal.setGoalCompleteWord(goalRequestDTO.getGoalCompleteWord());

        studyRepository.save(goal);
    }

    @Override
    public StudyProgressDTO getStudyProgress(Long userId) {
        Goal goal = studyRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("목표가 없습니다."));

        return StudyProgressDTO.builder()
                .goalReadNewsCount(goal.getGoalReadNewsCount())
                .goalPronounceTestScore(goal.getGoalPronounceTestScore())
                .goalCompleteWord(goal.getGoalCompleteWord())
                .currentReadNewsCount(goal.getCurrentReadNewsCount())
                .currentPronounceTestScore(goal.getCurrentPronounceTestScore())
                .currentCompleteWord(goal.getCurrentCompleteWord())
                .build();
    }
}
