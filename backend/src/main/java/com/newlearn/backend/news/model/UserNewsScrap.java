package com.newlearn.backend.news.model;

import com.newlearn.backend.user.model.Users;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Builder
@Table(name = "user_news_scrap")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Setter
public class UserNewsScrap {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_news_scrap_id")
    private Long userDailyNewsReadId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private Users user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "news_id")
    private News news;

    @Column(name = "difficulty", nullable = false)
    private Integer difficulty;

    @Column(name = "scraped_date", nullable = false)
    @Builder.Default
    private LocalDateTime scrapedDate = LocalDateTime.now();


}
