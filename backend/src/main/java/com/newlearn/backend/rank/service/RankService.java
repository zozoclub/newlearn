package com.newlearn.backend.rank.service;

import com.newlearn.backend.rank.model.UserRank;
import com.newlearn.backend.user.dto.response.UserRankDTO;

import java.util.List;

public interface RankService {

    void updateRankings();
    void saveRankings(List<UserRankDTO> ranks, String rankType);

    List<UserRank> getTopPointUsers();
    List<UserRank> getTopReaderUsers();
}
