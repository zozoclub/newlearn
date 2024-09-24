package com.newlearn.backend.study.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Entity
@Builder
@Table(name = "user_audio_files")
@NoArgsConstructor
@AllArgsConstructor
public class UserAudioFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "audio_file_id")
    private Long audioFileId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "example_sentence")
    private String exampleSentence;

    @Column(name = "pronunciation_score")
    private Long pronunciationScore;

    @Column(name = "audio_file_url")
    private String audioFileUrl;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

}
