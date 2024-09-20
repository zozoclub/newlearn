package com.newlearn.backend.word.repository;

import com.newlearn.backend.study.model.WordQuiz;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WordQuizRepository extends JpaRepository<WordQuiz, Long> {
}
