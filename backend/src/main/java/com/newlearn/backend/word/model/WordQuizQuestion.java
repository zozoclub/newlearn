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

//    @Column(name = "quiz_id", nullable = false)
//    private Long quizId;

    @ManyToOne
    @JoinColumn(name = "quiz_id")
    private WordQuiz wordQuiz;

    @ManyToOne
    @JoinColumn(name = "word_id")
    private Word word;

    @Column(name = "sentence", nullable = false)
    private String sentence;

    @Column(name = "sentence_meaning")
    private String sentenceMeaning;

    @Column(name = "correct_answer", nullable = false)
    private String correctAnswer;
}
