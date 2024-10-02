package com.newlearn.backend.user.service;

import java.util.List;

import com.newlearn.backend.user.dto.request.NewsPagenationRequestDTO;
import com.newlearn.backend.user.dto.request.UpdateAvatarDTO;
import com.newlearn.backend.user.dto.request.SignUpRequestDTO;
import com.newlearn.backend.user.dto.response.UserCategoryChartResponseDTO;
import com.newlearn.backend.user.dto.response.UserGrassResponseDTO;
import com.newlearn.backend.user.dto.response.UserProfileResponseDTO;
import com.newlearn.backend.user.dto.response.UserScrapedNewsResponseDTO;
import com.newlearn.backend.user.model.Users;
import org.springframework.data.domain.Page;

public interface UserService {

	Users findByEmail(String email) throws Exception;

	void signUp(SignUpRequestDTO signUpRequestDTO);

	void updateAvatar(Users user, UpdateAvatarDTO updateAvatarDTO);

	boolean checkNickname(String nickname);

	void updateNickname(Users user, String nickname);

	void updateDifficulty(Users user, Long difficulty);

	void updateCategory(Users user, List<String> categories);

	void deleteUser(Long userId);

	UserProfileResponseDTO getProfile(Long userId) throws Exception;

	// 마이페이지
	Page<UserScrapedNewsResponseDTO> getScrapedNewsList(Long userId, NewsPagenationRequestDTO newsPagenationRequestDTO, int difficulty);
	List<UserGrassResponseDTO> getGrass(Long userId);
	UserCategoryChartResponseDTO getCategoryChart(long userId);

	Long getUserRank(Long userId) throws Exception;

	void updateExperience(Users user, Long experience);
}
