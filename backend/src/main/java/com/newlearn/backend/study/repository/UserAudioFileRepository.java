package com.newlearn.backend.study.repository;

import com.newlearn.backend.study.model.UserAudioFile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserAudioFileRepository extends JpaRepository<UserAudioFile, Long> {
}
