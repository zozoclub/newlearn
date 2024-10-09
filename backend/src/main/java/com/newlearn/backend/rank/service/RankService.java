package com.newlearn.backend.rank.service;

import com.newlearn.backend.rank.dto.PointsRankDTO;
import com.newlearn.backend.rank.dto.ReadingRankDTO;
import com.newlearn.backend.rank.model.UserRank;
import com.newlearn.backend.user.dto.response.UserRankDTO;

import java.util.List;

public interface RankService {

    void updateRankings();
    List<PointsRankDTO> getRealtimeTopPointUsers();
    List<ReadingRankDTO> getRealtimeTopReaderUsers();
    void updateUserPoints(Long userId, int points);
    void updateUserReadCount(Long userId, int readCount);

}
