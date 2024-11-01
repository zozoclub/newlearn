package com.newlearn.backend.user.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Table(name = "avatar")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class Avatar {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long avatarId;

	@OneToOne
	@JoinColumn(name = "user_id", nullable = false)
	private Users user;

	private Long skin;

	private Long eyes;

	private Long mask;

}
