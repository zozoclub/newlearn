package com.newlearn.backend.rank.model;

import com.newlearn.backend.user.model.Users;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Builder
@Table(name = "user_rank", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "ranking_type", "month"})
})
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class UserRank {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;

    @Column(name = "ranking_type", nullable = false, length = 20)
    private String rankingType;

    @Column(name = "ranking", nullable = false)
    private Long ranking;

    @Column(name = "score", nullable = false)
    private Long score;

    @Column(name = "month", nullable = false)
    private LocalDate month;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}