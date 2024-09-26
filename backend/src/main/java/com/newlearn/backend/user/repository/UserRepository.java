package com.newlearn.backend.user.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.newlearn.backend.user.dto.response.UserRankDTO;
import com.newlearn.backend.user.model.Users;

@Repository
public interface UserRepository extends JpaRepository<Users, Long> {

	Optional<Users> findByEmail(String email);

	boolean existsByNickname(String nickname);

	Users findUserByUserId(long id);

	@Query(value = "SELECT new com.newlearn.backend.user.dto.response.UserRankDTO(u.userId, u.nickname, u.experience, " +
			"RANK() OVER (ORDER BY u.experience DESC)) " +
			"FROM Users u " +
			"ORDER BY u.experience DESC " +
			"LIMIT 10")
	List<UserRankDTO> findTop10ByExperience();

	@Query(value = "SELECT new com.newlearn.backend.user.dto.response.UserRankDTO(u.userId, u.nickname, u.totalNewsReadCount, " +
			"RANK() OVER (ORDER BY u.totalNewsReadCount DESC)) " +
			"FROM Users u " +
			"ORDER BY u.totalNewsReadCount DESC " +
			"LIMIT 10")
	List<UserRankDTO> findTop10ByNewsRead();
}