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
    @Column(name = "sentence_id")
    private Long sentenceId;

    // Word와의 1대1 관계 설정
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "word_id")
    private Word word;

    @Column(name = "news_id")
    private Long newsId;

    @Column(name = "difficulty")
    private Long difficulty;

    @Column(name = "sentence", nullable = false)
    private String sentence;

    @Column(name = "sentence_meaning", nullable = false)
    private String sentenceMeaning;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    // Word 설정
    public void setWord(Word word) {
        this.word = word;
    }
}
