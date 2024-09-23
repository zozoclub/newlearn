package com.newlearn.backend.word.model;

import com.newlearn.backend.user.model.Users;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Entity
@Builder
@Table(name = "word_quiz")
@NoArgsConstructor
@AllArgsConstructor
public class WordQuiz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long quizId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private Users user;

    @Column(name = "total_count")
    private Long totalCount;

    @Column(name = "correct_count")
    private Long correctCount = 0L;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
