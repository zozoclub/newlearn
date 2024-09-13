package com.newlearn.backend.user.service;

import java.util.Optional;

import com.newlearn.backend.user.dto.request.AvatarUpdateDTO;
import com.newlearn.backend.user.dto.request.SignUpRequestDTO;
import com.newlearn.backend.user.model.Users;

public interface UserService {

	Optional<Users> findByEmail(String email);

	void signUp(SignUpRequestDTO signUpRequestDTO);

	void updateAvatar(Long userId, AvatarUpdateDTO avatarUpdateDTO);

	boolean checkNickname(String nickname);

	void updateNickname(Long userId, String nickname);
}
