package com.newlearn.backend.user.service;

import org.springframework.stereotype.Service;

import com.newlearn.backend.user.model.UserTutorial;
import com.newlearn.backend.user.model.Users;
import com.newlearn.backend.user.repository.UserTutorialRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserTutorialService {

	private final UserTutorialRepository userTutorialRepository;

	public void completeTutorialPage(Users user, Long page) {

		boolean isCompleted = userTutorialRepository.existsByUserAndTutorialPageAndIsCompleted(user, page, true);

		if (!isCompleted) {
			UserTutorial userTutorial = UserTutorial.builder().user(user).tutorialPage(page).isCompleted(true).build();
			userTutorialRepository.save(userTutorial);
		}
	}

	public boolean isTutorialPageCompleted(Users user, Long page) {

		return userTutorialRepository.existsByUserAndTutorialPageAndIsCompleted(user, page, true);

	}

	public void cancelTutorialPage(Users user, Long page) {

		boolean isCompleted = userTutorialRepository.existsByUserAndTutorialPageAndIsCompleted(user, page, true);

		if (isCompleted) {
			UserTutorial userTutorial = UserTutorial.builder().user(user).tutorialPage(page).isCompleted(false).build();
			userTutorialRepository.save(userTutorial);
		}
	}
}
