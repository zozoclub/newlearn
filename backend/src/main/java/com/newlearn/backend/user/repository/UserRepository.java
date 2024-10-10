package com.newlearn.backend.user.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.newlearn.backend.user.model.Users;

@Repository
public interface UserRepository extends JpaRepository<Users, Long> {

	Optional<Users> findByEmail(String email);

	boolean existsByNickname(String nickname);

	Users findUserByUserId(long id);

	@Query(value = "SELECT u FROM Users u ORDER BY u.experience DESC")
	List<Users> findTop10ByOrderByExperienceDesc();

	@Query(value = "SELECT u FROM Users u ORDER BY u.totalNewsReadCount DESC")
	List<Users> findTop10ByOrderByTotalNewsReadCountDesc();

	@Query(value = "SELECT COUNT(*) + 1 AS user_rank FROM users u WHERE u.experience > (SELECT experience FROM users WHERE user_id = :userId)",
			nativeQuery = true)
	int findUserRankById(@Param("userId") Long userId);

}