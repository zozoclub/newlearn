package com.newlearn.backend.word.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.newlearn.backend.user.model.Users;
import com.newlearn.backend.word.model.Word;

public interface WordRepository extends JpaRepository<Word, Long> {

	List<Word> findAllByUser(Users users);

	List<Word> findByIsCompleteTrueAndUser(Users user);

	List<Word> findAllByWordAndUser(String word, Users user);

	List<Word> findByUserAndNextRestudyDateLessThanEqualAndIsFinalCompleteFalseAndIsCompleteTrue(Users user, LocalDateTime today);

	@Query("select count(w) from Word w where w.user = :user and w.isComplete = false")
	Long countIncompleteWordsByUser(Users user);

	@Query("select count(w) from Word w where w.user = :user and w.isComplete = true")
	Long countCompleteWordsByUser(Users user);

}
