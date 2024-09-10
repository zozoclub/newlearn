package com.newlearn.backend.user.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.newlearn.backend.user.model.Users;
import com.newlearn.backend.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@Service
@Slf4j
public class UserServiceImpl implements UserService{

	private final UserRepository userRepository;

	@Override
	public Optional<Users> findByEmail(String email) {
		return Optional.empty();
	}
}
