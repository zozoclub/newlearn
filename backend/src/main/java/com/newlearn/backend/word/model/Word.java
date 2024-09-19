package com.newlearn.backend.word.model;

import java.time.LocalDateTime;

import com.newlearn.backend.user.model.Users;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
	private Long wordId;

	private String word;

	private String meaning;

	private LocalDateTime nextDate;

	private int level;

	private boolean isComplete;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id")
	private Users user;

	//
	// public void markAsComplete() {
	// 	this.isComplete = true;
	// 	this.nextDate = LocalDateTime.now().plusDays(1);
	// 	this.level = 1;
	// }
	//
	// public void levelUp() {
	// 	if(this.isComplete) {
	// 		this.nextDate =
	// 	}
	// }
}
