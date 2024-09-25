package com.newlearn.backend.news.model;

import com.newlearn.backend.user.model.Users;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import java.time.LocalDateTime;

@Data
@Entity
@Builder
@Table(name = "user_news_read")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Setter
public class UserNewsRead {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_news_read_id")
    private Long userNewsReadId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private Users user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "news_id")
    private News news;

    @Column(name = "category_id")
    private Long categoryId;

    @Column(name = "read_high_translation", nullable = false)
    @Builder.Default
    private Boolean readHighTranslation = false;

    @Column(name = "read_medium_translation", nullable = false)
    @Builder.Default
    private Boolean readMediumTranslation = false;

    @Column(name = "read_low_translation", nullable = false)
    @Builder.Default
    private Boolean readLowTranslation = false;

    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();


    public void markAsRead(int difficulty) {
        switch (difficulty) {
            case 1:
                this.readLowTranslation = true;
                break;
            case 2:
                this.readMediumTranslation = true;
                break;
            case 3:
                this.readHighTranslation = true;
                break;
            default:
                throw new IllegalArgumentException("Invalid difficulty level: " + difficulty);
        }
    }
}
