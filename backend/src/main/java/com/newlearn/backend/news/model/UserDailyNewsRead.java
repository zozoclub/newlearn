package com.newlearn.backend.news.model;

import com.newlearn.backend.user.model.Users;
import org.hibernate.annotations.ColumnDefault;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Data
@Entity
@Builder
@Table(name = "user_daily_news_read")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Setter
public class UserDailyNewsRead {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_daily_news_read_id")
    private Long userDailyNewsReadId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private Users user;

    @Column(name = "today_date", nullable = false)
    private LocalDate todayDate;

    @Column(name = "news_read_count", nullable = false)
    @ColumnDefault("0")
    private Long newsReadCount;

    // 읽은 뉴스횟수 +1
    public void incrementNewsReadCount() {
        this.newsReadCount++;
    }

    // 날짜와 사용자로 엔티티 생성
    public static UserDailyNewsRead createForToday(Users user) {
        return UserDailyNewsRead.builder()
                .user(user)
                .todayDate(LocalDate.now())
                .newsReadCount(0L)
                .build();
    }
}
