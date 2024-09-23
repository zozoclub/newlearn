package com.newlearn.backend.oauth.repository;

import org.springframework.data.repository.CrudRepository;

import com.newlearn.backend.oauth.model.TempUser;

public interface TempUserRepository extends CrudRepository<TempUser, String> {
}
