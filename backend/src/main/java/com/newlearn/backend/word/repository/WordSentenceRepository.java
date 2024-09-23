package com.newlearn.backend.word.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.newlearn.backend.word.model.WordSentence;

public interface WordSentenceRepository extends JpaRepository<WordSentence, Long> {
}
