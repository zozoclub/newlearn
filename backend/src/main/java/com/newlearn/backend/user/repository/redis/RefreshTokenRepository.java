package com.newlearn.backend.user.repository.redis;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.newlearn.backend.user.model.RefreshToken;

import jakarta.persistence.Id;

@Repository
public interface RefreshTokenRepository extends CrudRepository<RefreshToken, String> {

	List<RefreshToken> findAllByUserEmail(String userEmail);

}
