package com.newlearn.backend.study.model;

import jakarta.persistence.*;
import lombok.*;

@Data
@Entity
@Builder
@Table(name = "word_quiz_answer")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
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
