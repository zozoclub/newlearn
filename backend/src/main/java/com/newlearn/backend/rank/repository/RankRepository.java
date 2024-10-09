package com.newlearn.backend.rank.repository;

import com.newlearn.backend.rank.model.UserRank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface RankRepository extends JpaRepository<UserRank, Long> {

    List<UserRank> findByRankingTypeAndMonthOrderByRankingAsc(
            @Param("rankingType") String rankingType,
            @Param("month") LocalDate month
    );

    @Modifying
    @Query("DELETE FROM UserRank ur WHERE ur.rankingType = :rankingType AND ur.month = :month")
    void deleteByRankingTypeAndMonth(
            @Param("rankingType") String rankingType,
            @Param("month") LocalDate month
    );

    @Query("SELECT MAX(ur.month) FROM UserRank ur")
    LocalDate findMaxMonth();
}