package com.newlearn.backend.rank.repository;

import com.newlearn.backend.rank.model.UserRank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface RankRepository extends JpaRepository<UserRank, Long> {

    List<UserRank> findTop10ByRankingTypeAndMonth(@Param("rankingType") String rankingType, @Param("currentMonth") LocalDate currentMonth);


}
