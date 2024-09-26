package com.newlearn.backend.study.service;

import com.newlearn.backend.study.repository.StudyRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class GoalResetScheduler {

	private final StudyRepository studyRepository;

	public GoalResetScheduler(StudyRepository studyRepository) {
		this.studyRepository = studyRepository;
	}

	// 매달 1일 오전 00:00
	@Scheduled(cron = "0 0 0 1 * *", zone = "Asia/Seoul")
	@Transactional
	public void deleteGoalsOnFirstDayOfMonth() {
		studyRepository.deleteAllGoals();
		System.out.println("모든 학습 목표가 삭제되었습니다.");
	}
}
