package com.newlearn.backend.user.model;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import org.hibernate.annotations.ColumnDefault;

import com.newlearn.backend.word.model.Word;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Data
@Entity
@Builder
@Table(name = "users")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@EqualsAndHashCode(of = "userId")
@ToString(exclude = {"avatar", "words"})
public class Users {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "user_id")
	private Long userId;

	@Column(name = "name", nullable = false)
	private String name;

	@Column(name = "email", nullable = false, unique = true)
	private String email;

	@Column(name = "nickname", nullable = false, unique = true)
	private String nickname;

	@Column(name = "provider")
	@ColumnDefault(value = "local")
	private String provider;

	@Column(name = "provider_id")
	private String providerId;

	@Column(name = "difficulty")
	private Long difficulty;

	@Column(name = "total_news_read_count")
	@ColumnDefault("0")
	private Long totalNewsReadCount;

	@Column(name = "total_word_count")
	@ColumnDefault("0")
	private Long totalWordCount;

	@Column(name = "scrap_count")
	@ColumnDefault("0")
	private Long scrapCount;

	@Column(name = "experience")
	@ColumnDefault("0")
	private Long experience;

	@OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
	private Avatar avatar;

	@Setter
	@ManyToMany
	@JoinTable(
		name = "user_category",
		joinColumns = @JoinColumn(name = "user_id"),
		inverseJoinColumns = @JoinColumn(name = "category_id")
	)
	private Set<Category> categories = new HashSet<>();

	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
	private Set<Word> words = new HashSet<>();

	@Column(name = "created_at", nullable = false, updatable = false,
		insertable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
	@Temporal(TemporalType.TIMESTAMP)
	private Date createdAt;

	public void updateOAuthInfo(String provider, String providerId) {
		this.provider = provider;
		this.providerId = providerId;
	}

	public void updateCategories(Set<Category> newCategories) {
		this.categories.clear();
		this.categories.addAll(newCategories);
	}

	public void addWord(Word word) {
		this.words.add(word);

		if (word.getUser() == null || word.getUser() != this) {
			word.setUser(this);
		}
	}

	// 조회수 +1
	public void incrementNewsReadCnt() {
		this.totalNewsReadCount++;
	}
	public void updateUserTotalNewsReadCnt(long cnt) {
		this.totalNewsReadCount = cnt;
	}
	// 스크랩수 +1
	public void incrementScrapCount() {
		this.scrapCount++;
	}
	public void updateUserTotalScrapCount(long cnt){
		this.scrapCount = cnt;
	}
	// 스크랩수 -1
	public void decrementScrapCount() {
		this.scrapCount--;
	}
	// 경험치
	public void incrementExperience(Long experience) {
		this.experience += experience;
	}
}
