package com.newlearn.backend.study.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Entity
@Builder
@Table(name = "pronounce_test")
@NoArgsConstructor
@AllArgsConstructor
@IdClass(PronounceTestId.class)
public class PronounceTest {

    @Id
    @Column(name = "audio_file_id", nullable = false)
    private Long audioFileId;

    @Id
    @Column(name = "sentence_id", nullable = false)
    private Long sentenceId;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

}
