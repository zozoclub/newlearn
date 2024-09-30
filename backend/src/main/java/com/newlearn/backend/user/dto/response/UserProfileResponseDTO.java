package com.newlearn.backend.user.dto.response;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import com.newlearn.backend.user.model.Category;
import com.newlearn.backend.user.model.Users;

import lombok.Builder;
import lombok.Getter;

@Getter
public class UserProfileResponseDTO {

	private Long userId;
	private String email;
	private String nickname;
	private String name;
	private String provider;
	private Long rank;
	private Long difficulty;
	private List<String> categories;
	private Long experience;
	private Long totalNewsReadCount;
	private Long unCompleteWordCount;
	private Long completeWordCount;
	private Long scrapCount;

	private Long skin;
	private Long eyes;
	private Long mask;

	public UserProfileResponseDTO(Users user, Long unCompleteWordCount, Long completeWordCount, Long userRank) {
		this.userId = user.getUserId();
		this.email = user.getEmail();
		this.nickname = user.getNickname();
		this.rank = userRank;
		this.name = user.getName();
		this.provider = user.getProvider();
		this.difficulty = user.getDifficulty();
		this.experience = user.getExperience();
		this.totalNewsReadCount = user.getTotalNewsReadCount();
		this.unCompleteWordCount = unCompleteWordCount;
		this.completeWordCount = completeWordCount;
		this.scrapCount = user.getScrapCount();
		this.skin = user.getAvatar().getSkin();
		this.eyes = user.getAvatar().getEyes();
		this.mask = user.getAvatar().getMask();

		// interests 초기화
		Set<Category> set = user.getCategories();
		this.categories = new ArrayList<>();
		for (Category category : set) {
			this.categories.add(category.getCategoryName());
		}
	}
}
