package com.newlearn.backend.study.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

@Data
@Entity
@Builder
@Table(name = "goal")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class Goal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "goal_id")
    private Long goalId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "goal_read_news_count")
    private Long goalReadNewsCount;

    @Column(name = "goal_pronounce_test_score")
    private Long goalPronounceTestScore;

    @Column(name = "goal_complete_word")
    private Long goalCompleteWord;

    @Column(name = "current_read_news_count", nullable = false)
    @ColumnDefault("0")
    private Long currentReadNewsCount = 0L;

    @Column(name = "current_pronounce_test_score", nullable = false)
    @ColumnDefault("0")
    private Long currentPronounceTestScore = 0L;

    @Column(name = "current_complete_word", nullable = false)
    @ColumnDefault("0")
    private Long currentCompleteWord = 0L;
}

