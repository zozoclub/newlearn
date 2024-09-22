package com.newlearn.backend.word.model;

import java.time.LocalDateTime;

import com.newlearn.backend.user.model.Users;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Table(name = "word")
@Entity
@Builder
@AllArgsConstructor
public class Word {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "word_id")
	private Long wordId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id")
	private Users user;

	@Column(nullable = false)
	private String word;

	@Column(name = "word_meaning", columnDefinition = "TEXT")
	private String wordMeaning;

	@Column(name = "is_complete")
	private boolean isComplete = false;

	@Column(name = "next_restudy_date")
	private LocalDateTime nextRestudyDate;

	@Column(name = "restudy_level")
	private int restudyLevel = 0;

	@Column(name = "last_restudy_date")
	private LocalDateTime lastRestudyDate;

	@Column(name = "is_final_complete")
	private boolean isFinalComplete = false;

	@Column(name = "created_at")
	private LocalDateTime createdAt = LocalDateTime.now();

	public void completeWord() {
		this.isComplete = true;
		this.nextRestudyDate = LocalDateTime.now().plusDays(1);
		this.restudyLevel = 1;
	}

	public void restudy(boolean remembered) {
		if (remembered) {
			levelUp();
		} else {
			resetLevel();
		}
		this.lastRestudyDate = LocalDateTime.now();
	}

	private void levelUp() {
		this.restudyLevel++;
		this.nextRestudyDate = LocalDateTime.now().plusDays(getNextReviewInterval());
	}

	private void resetLevel() {
		this.restudyLevel = 1;
		this.nextRestudyDate = LocalDateTime.now().plusDays(1);
	}

	private int getNextReviewInterval() {
		switch (this.restudyLevel) {
			case 1: return 1;  // 1일 후
			case 2: return 3;  // 3일 후
			case 3: return 7;  // 7일 후
			case 4: return 30; // 30일 후
			default: return 60; // 60일 후 (또는 다른 적절한 간격)
		}
	}

}
