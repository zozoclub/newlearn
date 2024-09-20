package com.newlearn.backend.word.model;

import jakarta.persistence.*;
import lombok.*;

@Getter
@NoArgsConstructor
@Table(name = "word_quiz_answer")
@Entity
@Builder
@AllArgsConstructor
public class WordQuizAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long wordQuizAnswerId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "word_quiz_question_id")
    private WordQuizQuestion wordQuizQuestion;

    @Column(name = "answer")
    private String answer;

    @Column(name = "is_correct")
    private Boolean isCorrect;
}
