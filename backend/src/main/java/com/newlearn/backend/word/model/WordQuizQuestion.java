package com.newlearn.backend.word.model;

import jakarta.persistence.*;
import lombok.*;

@Data
@Entity
@Builder
@Table(name = "word_quiz_question")
@NoArgsConstructor
@AllArgsConstructor
public class WordQuizQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long wordQuizQuestionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id")
    private WordQuiz quiz;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "word_id")
    private Word word;

    @Column(name = "sentence")
    private String sentence;

    @Column(name = "sentence_meaning")
    private String sentenceMeaning;

    @Column(name = "correct_answer")
    private String correctAnswer;
}
