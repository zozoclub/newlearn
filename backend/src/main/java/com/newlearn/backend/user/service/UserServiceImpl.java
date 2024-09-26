package com.newlearn.backend.user.service;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

import com.newlearn.backend.news.model.UserNewsRead;
import com.newlearn.backend.news.model.UserNewsScrap;
import com.newlearn.backend.news.repository.UserNewsReadRepository;
import com.newlearn.backend.news.repository.UserNewsScrapRepository;
import com.newlearn.backend.user.dto.request.NewsPagenationRequestDTO;
import com.newlearn.backend.user.dto.response.UserCategoryChartResponseDTO;
import com.newlearn.backend.user.dto.response.UserScrapedNewsResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.newlearn.backend.user.dto.request.UpdateAvatarDTO;
import com.newlearn.backend.user.dto.request.SignUpRequestDTO;
import com.newlearn.backend.user.dto.response.UserProfileResponseDTO;
import com.newlearn.backend.user.model.Avatar;
import com.newlearn.backend.user.model.Category;
import com.newlearn.backend.user.model.Users;
import com.newlearn.backend.user.repository.AvatarRepository;
import com.newlearn.backend.user.repository.CategoryRepository;
import com.newlearn.backend.user.repository.UserRepository;
import com.newlearn.backend.word.repository.WordRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import static com.newlearn.backend.user.dto.response.UserScrapedNewsResponseDTO.makeScrapedNewsResponseDTO;

@RequiredArgsConstructor
@Service
@Slf4j
public class UserServiceImpl implements UserService{

	private final UserRepository userRepository;
	private final AvatarRepository avatarRepository;
	private final CategoryRepository categoryRepository;
	private final WordRepository wordRepository;
	private final UserNewsScrapRepository userNewsScrapRepository;
	private final UserNewsReadRepository userNewsReadRepository;

	@Override
	public Users findByEmail(String email) throws Exception {

		return userRepository.findByEmail(email).get();
	}

	@Override
	@Transactional
	public void signUp(SignUpRequestDTO signUpRequestDTO) {

		Optional<Users> existingUser = userRepository.findByEmail(signUpRequestDTO.getEmail());

		if (existingUser.isPresent()) {
			throw new IllegalStateException("이미 사용자가 존재합니다.");
		}

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

	@Override
	public void deleteUser(Long userId) {

		userRepository.deleteById(userId);
	}

	@Override
	public UserProfileResponseDTO getProfile(Long userId) {

		Users user = userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다"));

		Long unCount = wordRepository.countCompleteWordsByUser(user);
		Long Count = wordRepository.countIncompleteWordsByUser(user);

		return new UserProfileResponseDTO(user, unCount, Count);

	}

	/* 마이페이지 */

	@Override
	public Page<UserScrapedNewsResponseDTO> getScrapedNewsList(Long userId, NewsPagenationRequestDTO newsPagenationRequestDTO, int difficulty) {
		Users user = userRepository.findById(userId)
				.orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다."));

		// 1. UserNewsScrapRepository에서 사용자가 스크랩한 뉴스 가져오기
		// 전체조회 (유저) : 난이도 별 조회 (유저 & difficulty)
		Page<UserNewsScrap> newsList = (difficulty == 0)
				? userNewsScrapRepository.findAllByUserOrderByScrapedDate(user, newsPagenationRequestDTO.getPageable())
				: userNewsScrapRepository.findAllByUserAndDifficultyOrderByScrapedDate(user, difficulty, newsPagenationRequestDTO.getPageable());

		// 2. 관련된 모든 UserNewsRead를 한 번에 조회
		// 유저가 스크랩한 뉴스들의 Id 리스트
		List<Long> newsIds = newsList.getContent().stream()
				.map(scrap -> scrap.getNews().getNewsId())
				.collect(Collectors.toList());

		Map<Long, UserNewsRead> readStatusMap = userNewsReadRepository.findAllByUserAndNewsNewsIdIn(user, newsIds).stream()
				.collect(Collectors.toMap(read -> read.getNews().getNewsId(), Function.identity()));

		// 3. UserScrapedNewsResponseDTO로 변환 및 새로운 Page 객체 생성
		return newsList.map(scrap -> makeScrapedNewsResponseDTO(scrap, readStatusMap.get(scrap.getNews().getNewsId()), "en", difficulty));

	}

	@Override
	public UserCategoryChartResponseDTO getCategoryChart(long userId) {
		Users user = userRepository.findById(userId)
				.orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다."));
		Long[] counts = new Long[6];
		for (int i = 0; i < 6; i++) {
			counts[i] = userNewsReadRepository.countByUserAndCategoryId(user, i + 1L);
		}

		return UserCategoryChartResponseDTO.builder()
				.politicsCount(counts[0])
				.economyCount(counts[1])
				.societyCount(counts[2])
				.cultureCount(counts[3])
				.scienceCount(counts[4])
				.worldCount(counts[5])
				.build();
	}


}
