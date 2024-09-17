package com.newlearn.backend.user.service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.newlearn.backend.user.dto.request.UpdateAvatarDTO;
import com.newlearn.backend.user.dto.request.SignUpRequestDTO;
import com.newlearn.backend.user.model.Avatar;
import com.newlearn.backend.user.model.Category;
import com.newlearn.backend.user.model.Users;
import com.newlearn.backend.user.repository.AvatarRepository;
import com.newlearn.backend.user.repository.CategoryRepository;
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
	private final CategoryRepository categoryRepository;

	@Override
	public Optional<Users> findByEmail(String email) {
		return Optional.empty();
	}

	@Override
	@Transactional
	public void signUp(SignUpRequestDTO signUpRequestDTO) {
		Users user = signUpRequestDTO.toUserEntity();

		Set<Category> categories = new HashSet<>();
		for(String categoryName : signUpRequestDTO.getCategories()) {
			Category category = categoryRepository.findByCategoryName(categoryName);
			categories.add(category);
		}
		user.setCategories(categories);

		Avatar avatar = signUpRequestDTO.toAvatarEntity(user);
		user.setAvatar(avatar);

		userRepository.save(user);
	}

	@Override
	@Transactional
	public void updateAvatar(Long userId, UpdateAvatarDTO updateAvatarDTO) {
		Users user = userRepository.findById(userId)
			.orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다"));

		Avatar avatar = user.getAvatar();
		if (avatar == null) {
			throw new EntityNotFoundException("아바타를 찾을 수 없습니다.");
		}

		avatar.setSkin(updateAvatarDTO.getSkin());
		avatar.setEyes(updateAvatarDTO.getEyes());
		avatar.setMask(updateAvatarDTO.getMask());

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

	@Override
	public void updateDifficulty(Long userId, Long difficulty) {
		Users user = userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다"));

		user.setDifficulty(difficulty);
		userRepository.save(user);
	}

	@Override
	public void updateCategory(Long userId, List<String> categories) {

		Users user = userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다"));

		Set<Category> newCategories = new HashSet<>();
		for(String categoryName : categories) {
			Category category = categoryRepository.findByCategoryName(categoryName);
			newCategories.add(category);
		}
		user.updateCategories(newCategories);

		userRepository.save(user);
	}


}
