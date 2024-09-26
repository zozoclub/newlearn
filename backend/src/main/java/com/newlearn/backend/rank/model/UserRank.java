package com.newlearn.backend.rank.model;

import com.newlearn.backend.user.model.Users;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Data
@Entity
@Builder
@Table(name = "user_rank")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class UserRank {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private Users user;

    @Column(name = "ranking_type")
    private String rankingType;

    @Column(name = "ranking")
    private int ranking;

    @Column(name = "month")
    private LocalDate month;

}
