package com.newlearn.backend.word.repository;

import com.newlearn.backend.word.model.Word;
import com.newlearn.backend.word.model.WordQuiz;
import com.newlearn.backend.word.model.WordQuizQuestion;
import com.newlearn.backend.word.model.WordSentence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface WordQuizQuestionRepository extends JpaRepository<WordQuizQuestion, Long> {

    List<WordQuizQuestion> findByWordQuiz(WordQuiz wordQuiz);

    @Query("SELECT w FROM Word w WHERE w.user.userId = :userId ORDER BY FUNCTION('RAND') LIMIT :totalCount")
    List<Word> findRandomWords(@Param("userId") Long userId, @Param("totalCount") Long totalCount);

    @Query("SELECT ws FROM WordSentence ws WHERE ws.word.wordId = :wordId ORDER BY FUNCTION('RAND') LIMIT 1")
    WordSentence findRandomSentenceByWordId(@Param("wordId") Long wordId);

}
