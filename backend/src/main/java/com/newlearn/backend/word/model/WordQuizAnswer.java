package com.newlearn.backend.word.model;

import jakarta.persistence.*;
import lombok.*;

@Data
@Entity
@Builder
@Table(name = "word_quiz_answer")
@NoArgsConstructor
@AllArgsConstructor
public class WordQuizAnswer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long wordQuizAnswerId;

    @ManyToOne
    @JoinColumn(name = "word_quiz_question_id")
    private WordQuizQuestion wordQuizQuestion;

    @Column(name = "answer", nullable = false)
    private String answer;

    @Column(name = "is_correct", nullable = false)
    private Boolean isCorrect;
}