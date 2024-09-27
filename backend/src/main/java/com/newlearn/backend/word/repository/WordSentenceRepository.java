package com.newlearn.backend.word.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.newlearn.backend.word.model.WordSentence;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface WordSentenceRepository extends JpaRepository<WordSentence, Long> {
    @Query("SELECT ws " +
            "FROM WordSentence ws " +
            "WHERE ws.newsId = :newsId " +
            "AND ws.word.wordId IN :wordIds " +
            "AND ws.difficulty = :difficulty")
    List<WordSentence> findByNewsIdAndWordIdsAndDifficulty(
            @Param("newsId") Long newsId,
            @Param("wordIds") List<Long> wordIds,
            @Param("difficulty") Integer difficulty
    );
}