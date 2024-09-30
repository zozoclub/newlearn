package com.newlearn.backend.rank.service;

import com.newlearn.backend.rank.dto.PointsRankDTO;
import com.newlearn.backend.rank.dto.ReadingRankDTO;
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
import java.util.stream.Collectors;

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
    public List<PointsRankDTO> getTopPointUsers() {
        LocalDate currentMonth = LocalDate.now().withDayOfMonth(1);
        List<UserRank> userRanks = rankRepository.findTop10ByRankingTypeAndMonth("points", currentMonth);

        return userRanks.stream()
                .map(userRank -> PointsRankDTO.builder()
                        .userId(userRank.getUser().getUserId())
                        .nickname(userRank.getUser().getNickname())
                        .experience(userRank.getUser().getExperience())
                        .ranking(userRank.getRanking())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public List<ReadingRankDTO> getTopReaderUsers() {
        LocalDate currentMonth = LocalDate.now().withDayOfMonth(1);
        List<UserRank> userRanks = rankRepository.findTop10ByRankingTypeAndMonth("reading", currentMonth);

        return userRanks.stream()
                .map(userRank -> ReadingRankDTO.builder()
                        .userId(userRank.getUser().getUserId())
                        .nickname(userRank.getUser().getNickname())
                        .experience(userRank.getUser().getExperience())
                        .totalNewsReadCount(userRank.getUser().getTotalNewsReadCount())
                        .ranking(userRank.getRanking())
                        .build())
                .collect(Collectors.toList());
    }
}
