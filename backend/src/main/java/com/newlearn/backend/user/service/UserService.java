package com.newlearn.backend.user.service;

import java.util.Optional;

import com.newlearn.backend.user.model.Users;

public interface UserService {

	Optional<Users> findByEmail(String email);
}
