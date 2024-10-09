package com.newlearn.backend.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.newlearn.backend.user.model.UserTutorial;
import com.newlearn.backend.user.model.Users;

@Repository
public interface UserTutorialRepository extends JpaRepository<UserTutorial, Long> {

	boolean existsByUserAndTutorialPageAndIsCompleted(Users user, Long tutorialPage, Boolean isCompleted);

}
