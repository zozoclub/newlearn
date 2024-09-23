package com.newlearn.backend.word.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.newlearn.backend.user.model.Users;
import com.newlearn.backend.word.model.Word;

public interface WordRepository extends JpaRepository<Word, Long> {

	List<Word> findAllByUser(Users users);

	List<Word> findByIsCompleteTrueAndUser(Users user);

	Word findByWordAndUser(String word, Users user);

}
