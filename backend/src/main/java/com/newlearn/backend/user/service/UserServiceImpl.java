package com.newlearn.backend.user.service;

import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.newlearn.backend.user.dto.request.AvatarUpdateDTO;
import com.newlearn.backend.user.dto.request.SignUpRequestDTO;
import com.newlearn.backend.user.model.Avatar;
import com.newlearn.backend.user.model.Users;
import com.newlearn.backend.user.repository.AvatarRepository;
import com.newlearn.backend.user.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@Service
@Slf4j
public class UserServiceImpl implements UserService{

	private final UserRepository userRepository;
	private final AvatarRepository avatarRepository;

	@Override
	public Optional<Users> findByEmail(String email) {
		return Optional.empty();
	}

	@Override
	@Transactional
	public void signUp(SignUpRequestDTO signUpRequestDTO) {

		Users savedUser = userRepository.save(signUpRequestDTO.toUserEntity());

		avatarRepository.save(signUpRequestDTO.toAvatarEntity(savedUser.getUserId()));
	}

	@Override
	public void updateAvatar(Long userId, AvatarUpdateDTO avatarUpdateDTO) {

		Avatar avatar = avatarRepository.findByUserId(userId).orElseThrow(() -> new EntityNotFoundException("Avatar not found"));
		avatar.setSkin(avatarUpdateDTO.getSkin());
		avatar.setEyes(avatarUpdateDTO.getEyes());
		avatar.setMask(avatarUpdateDTO.getMask());

		avatarRepository.save(avatar);
	}

	@Override
	public boolean checkNickname(String nickname) {
		return userRepository.existsByNickname(nickname);
	}

	@Override
	public void updateNickname(Long userId, String nickname) {

		Users user = userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다"));

		user.setNickname(nickname);
		userRepository.save(user);
	}
}
