package com.newlearn.backend.word.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@Table(name = "word_sentence")
@Entity
@Builder
@AllArgsConstructor
public class WordSentence {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long sentenceId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "word_id")
    private Word word;

    @Column(name = "news_id")
    private Long newsId;

    private int difficulty;

    @Column(name = "sentence")
    private String sentence;

    @Column(name = "sentence_meaning")
    private String sentenceMeaning;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
