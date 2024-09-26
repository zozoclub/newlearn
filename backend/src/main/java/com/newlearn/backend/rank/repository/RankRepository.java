package com.newlearn.backend.rank.repository;

import com.newlearn.backend.rank.model.UserRank;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RankRepository extends JpaRepository<UserRank, Long> {

    List<UserRank> findTop10ByRankingTypeOrderByRanking(String rankType);

}
