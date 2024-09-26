package com.newlearn.backend.rank.service;

import com.newlearn.backend.rank.model.UserRank;
import com.newlearn.backend.rank.repository.RankRepository;
import com.newlearn.backend.user.dto.response.UserRankDTO;
import com.newlearn.backend.user.model.Users;
import com.newlearn.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@RequiredArgsConstructor
@Service
@Slf4j
public class RankServiceImpl implements RankService {

    private final UserRepository userRepository;
    private final RankRepository rankRepository;

    @Override
    public void updateRankings() {
        List<UserRankDTO> experienceRanks = userRepository.findTop10ByExperience();
        saveRankings(experienceRanks, "points");

        List<UserRankDTO> newsReadRanks = userRepository.findTop10ByNewsRead();
        saveRankings(newsReadRanks, "reading");
    }

    @Override
    public void saveRankings(List<UserRankDTO> ranks, String rankType) {
        for (int i = 0; i < ranks.size(); i++) {
            UserRankDTO userRankDTO = ranks.get(i);

            Users user = userRepository.findUserByUserId(userRankDTO.getUserId());
            if (user == null) {
                continue;
            }

            UserRank rank = UserRank.builder()
                    .user(user)
                    .rankingType(rankType)
                    .ranking(i + 1)
                    .month(LocalDate.now().withDayOfMonth(1))
                    .build();

            rankRepository.save(rank);
        }
    }

    @Override
    public List<UserRank> getTopPointUsers() {
        return rankRepository.findTop10ByRankingTypeOrderByRanking("points");
    }

    @Override
    public List<UserRank> getTopReaderUsers() {
        return rankRepository.findTop10ByRankingTypeOrderByRanking("reading");
    }
}
