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
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Data
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
	private Long restudyLevel = 0L;

	@Column(name = "is_final_complete")
	private boolean isFinalComplete = false;

	@Column(name = "created_at")
	private LocalDateTime createdAt;

	public void completeWord() {
		this.isComplete = true;
		this.nextRestudyDate = LocalDateTime.now().plusDays(1);
		this.restudyLevel = 1L;
	}

	public void restudy(boolean remembered) {
		if (remembered) {
			levelUp();
		} else {
			resetLevel();
		}
	}

	private void levelUp() {
		this.restudyLevel++;
		if(this.restudyLevel == 6L) {
			this.isFinalComplete = true;
		}
		else {
			this.nextRestudyDate = LocalDateTime.now().plusDays(getNextReviewInterval());
		}
	}

	private void resetLevel() {
		this.restudyLevel = 1L;
		this.nextRestudyDate = LocalDateTime.now().plusDays(1);
	}

	private int getNextReviewInterval() {
		if(this.restudyLevel==1L) {
			return 1;
		}
		else if(this.restudyLevel==2L) {
			return 3;
		}
		else if(this.restudyLevel==3L) {
			return 7;
		}
		else if(this.restudyLevel==4L) {
			return 30;
		}
		else {
			return 60;
		}
	}

}
