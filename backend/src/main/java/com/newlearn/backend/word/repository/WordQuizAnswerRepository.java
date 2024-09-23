package com.newlearn.backend.word.repository;

import com.newlearn.backend.word.model.WordQuizAnswer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WordQuizAnswerRepository extends JpaRepository<WordQuizAnswer, Long> {
}
