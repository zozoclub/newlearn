package com.newlearn.backend.word.repository;

import com.newlearn.backend.word.model.Word;
import com.newlearn.backend.word.model.WordQuiz;
import com.newlearn.backend.word.model.WordQuizQuestion;
import com.newlearn.backend.word.model.WordSentence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface WordQuizQuestionRepository extends JpaRepository<WordQuizQuestion, Long> {

    List<WordQuizQuestion> findByWordQuiz(WordQuiz wordQuiz);

    Optional<WordQuizQuestion> findByWordQuizAndSentence(WordQuiz wordQuiz, String sentence);

    @Query("SELECT w FROM Word w WHERE w.user.userId = :userId and w.isComplete is false and w.isFinalComplete is false and w.isDelete is false ORDER BY FUNCTION('RAND') LIMIT :totalCount")
    List<Word> findRandomWordsforWordTest(@Param("userId") Long userId, @Param("totalCount") Long totalCount);

    @Query("SELECT w FROM Word w WHERE w.user.userId = :userId and w.isDelete is false ORDER BY FUNCTION('RAND') LIMIT :totalCount")
    List<Word> findRandomWordsforPronounceTest(@Param("userId") Long userId, @Param("totalCount") Long totalCount);

    @Query("SELECT ws FROM WordSentence ws WHERE ws.word.wordId = :wordId ORDER BY FUNCTION('RAND') LIMIT 1")
    WordSentence findRandomSentenceByWordId(@Param("wordId") Long wordId);

}
