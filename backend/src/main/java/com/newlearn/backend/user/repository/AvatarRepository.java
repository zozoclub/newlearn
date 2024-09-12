package com.newlearn.backend.user.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.newlearn.backend.user.model.Avatar;

public interface AvatarRepository extends JpaRepository<Avatar, Long> {

	Optional<Avatar> findByUserId(Long userId);
}
