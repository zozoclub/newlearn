package com.newlearn.backend.word.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

import com.newlearn.backend.user.model.Users;

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

	// Word와 WordSentence 간의 1대1 연관 관계 설정
	@OneToOne(mappedBy = "word", cascade = CascadeType.ALL, orphanRemoval = true)
	private WordSentence sentence;

	// 문장 추가
	public void addSentence(WordSentence sentence) {
		this.sentence = sentence;
		sentence.setWord(this);
	}

	public void completeWord() {
		this.isComplete = true;
		this.nextRestudyDate = LocalDateTime.now().plusDays(1);
		this.restudyLevel = 1L;
	}

	// 복습 관련 로직
	public void restudy(boolean remembered) {
		if (remembered) {
			levelUp();
		} else {
			resetLevel();
		}
	}

	private void levelUp() {
		this.restudyLevel++;
		if (this.restudyLevel == 6L) {
			this.isFinalComplete = true;
		} else {
			this.nextRestudyDate = LocalDateTime.now().plusDays(getNextReviewInterval());
		}
	}

	private void resetLevel() {
		this.restudyLevel = 1L;
		this.nextRestudyDate = LocalDateTime.now().plusDays(1);
	}

	private int getNextReviewInterval() {
		switch (this.restudyLevel.intValue()) {
			case 1: return 1;
			case 2: return 3;
			case 3: return 7;
			case 4: return 30;
			default: return 60;
		}
	}
}
