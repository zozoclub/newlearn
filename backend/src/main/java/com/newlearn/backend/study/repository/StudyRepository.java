package com.newlearn.backend.study.repository;

import com.newlearn.backend.study.model.Goal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudyRepository extends JpaRepository<Goal, Long> {

    Optional<Goal> findByUserId(Long userId);
}
