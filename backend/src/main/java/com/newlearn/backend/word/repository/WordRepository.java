package com.newlearn.backend.word.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.newlearn.backend.word.model.Word;

public interface WordRepository extends JpaRepository<Word, Long> {
}
