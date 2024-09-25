package com.newlearn.backend.study.repository;

import com.newlearn.backend.study.model.PronounceTest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PronounceTestRepository extends JpaRepository<PronounceTest, Long> {
    List<PronounceTest> findByAudioFileId(Long audioFileId);
}
