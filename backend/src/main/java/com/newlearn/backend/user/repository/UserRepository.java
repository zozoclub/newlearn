package com.newlearn.backend.user.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.newlearn.backend.user.model.Users;

@Repository
public interface UserRepository extends JpaRepository<Users, Long> {

	Optional<Users> findByEmail(String email);

	Optional<Users> findByUserId(Long userId);

	boolean existsByNickname(String nickname);
}
