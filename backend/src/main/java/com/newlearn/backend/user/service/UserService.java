package com.newlearn.backend.user.service;

import java.util.List;
import java.util.Optional;

import com.newlearn.backend.user.dto.request.UpdateAvatarDTO;
import com.newlearn.backend.user.dto.request.SignUpRequestDTO;
import com.newlearn.backend.user.model.Users;

public interface UserService {

	Users findByEmail(String email) throws Exception;

	void signUp(SignUpRequestDTO signUpRequestDTO);

	void updateAvatar(Long userId, UpdateAvatarDTO updateAvatarDTO);

	boolean checkNickname(String nickname);

	void updateNickname(Long userId, String nickname);

	void updateDifficulty(Long userId, Long difficulty);

	void updateCategory(Long userId, List<String> categories);

	void deleteUser(Long userId);
}
