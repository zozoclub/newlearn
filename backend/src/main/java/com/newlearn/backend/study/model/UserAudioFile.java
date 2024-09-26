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

    @Column(name = "audio_file_url")
    private String audioFileUrl;

    @Column(name = "accuracy_score")
    private Long accuracyScore;

    @Column(name = "fluency_score")
    private Long fluencyScore;

    @Column(name = "completeness_score")
    private Long completenessScore;

    @Column(name = "prosody_score")
    private Long prosodyScore;

    @Column(name = "total_score")
    private Long totalScore;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

}
