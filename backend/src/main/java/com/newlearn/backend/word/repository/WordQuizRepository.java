package com.newlearn.backend.word.repository;

import com.newlearn.backend.word.model.WordQuiz;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WordQuizRepository extends JpaRepository<WordQuiz, Long> {
    List<WordQuiz> findByUserIdOrderByQuizIdDesc(Long userId);
    void deleteById(Long quizId);
}
