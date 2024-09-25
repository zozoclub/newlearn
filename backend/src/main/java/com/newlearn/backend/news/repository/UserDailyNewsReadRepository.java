package com.newlearn.backend.news.repository;

import com.newlearn.backend.news.model.UserDailyNewsRead;
import com.newlearn.backend.user.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.time.LocalDate;

public interface UserDailyNewsReadRepository extends JpaRepository<UserDailyNewsRead, Long> {
    Optional<UserDailyNewsRead> findByUserAndTodayDate(Users user, LocalDate date);
}