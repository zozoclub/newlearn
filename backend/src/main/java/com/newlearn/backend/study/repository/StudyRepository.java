package com.newlearn.backend.study.repository;

import com.newlearn.backend.study.model.Goal;
import com.newlearn.backend.word.model.Word;
import com.newlearn.backend.word.model.WordSentence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface StudyRepository extends JpaRepository<Goal, Long> {

    Optional<Goal> findByUserId(Long userId);

}
