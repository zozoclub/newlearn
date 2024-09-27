package com.newlearn.backend.word.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.newlearn.backend.word.model.WordSentence;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface WordSentenceRepository extends JpaRepository<WordSentence, Long> {
//    @Query("SELECT ws FROM WordSentence ws " +
//            "LEFT JOIN ws.word w " +
//            "WHERE ws.newsId = :newsId " +
//            "AND w.wordId = :wordId " +
//            "AND ws.difficulty = :difficulty")
//    Optional<WordSentence> findOptionalByNewsIdAndWordIdAndDifficulty(
//            @Param("newsId") Long newsId,
//            @Param("wordId") Long wordId,
//            @Param("difficulty") Integer difficulty
//    );
    @Query("SELECT ws FROM WordSentence ws " +
            "LEFT JOIN ws.word w " +
            "WHERE ws.newsId = :newsId " +
            "AND w.wordId IN :wordIds " +
            "AND ws.difficulty = :difficulty")
    List<WordSentence> findByNewsIdAndWordIdsAndDifficulty(
            @Param("newsId") Long newsId,
            @Param("wordIds") List<Long> wordIds,
            @Param("difficulty") Integer difficulty
    );


}