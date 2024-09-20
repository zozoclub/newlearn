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

    @Query("SELECT w FROM Word w WHERE w.user.userId = :userId ORDER BY FUNCTION('RAND') LIMIT :totalCount")
    List<Word> findRandomWords(@Param("userId") Long userId, @Param("totalCount") Long totalCount);

    @Query("SELECT ws FROM WordSentence ws WHERE ws.word.wordId = :wordId ORDER BY FUNCTION('RAND') LIMIT 1")
    WordSentence findRandomSentenceByWordId(@Param("wordId") Long wordId);

}
