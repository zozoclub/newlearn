package com.newlearn.backend.oauth.repository;

import org.springframework.data.repository.CrudRepository;

import com.newlearn.backend.oauth.model.OAuthCodeToken;

public interface OAuthCodeTokenRepository extends CrudRepository<OAuthCodeToken, String> {
}
