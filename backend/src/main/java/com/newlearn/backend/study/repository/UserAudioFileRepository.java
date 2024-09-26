package com.newlearn.backend.study.repository;

import com.newlearn.backend.study.model.UserAudioFile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserAudioFileRepository extends JpaRepository<UserAudioFile, Long> {
    List<UserAudioFile> findByUserId(Long id);
    Optional<UserAudioFile> findById(Long audioFileId);
}