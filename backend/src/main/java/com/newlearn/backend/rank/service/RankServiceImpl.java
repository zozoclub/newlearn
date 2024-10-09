package com.newlearn.backend.rank.service;

import com.newlearn.backend.rank.dto.PointsRankDTO;
import com.newlearn.backend.rank.dto.ReadingRankDTO;
import com.newlearn.backend.rank.model.UserRank;
import com.newlearn.backend.rank.repository.RankRepository;
import com.newlearn.backend.user.model.Users;
import com.newlearn.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@RequiredArgsConstructor
@Service
@Slf4j
public class RankServiceImpl implements RankService {

    private final UserRepository userRepository;
    private final RankRepository rankRepository;
    private final RedisTemplate<String, String> redisTemplate;

    private static final String POINTS_RANK_KEY = "points_rank";
    private static final String READING_RANK_KEY = "reading_rank";
    private static final int TOP_RANK_COUNT = 10;

    @Override
    @Scheduled(fixedRate = 300000) // 5분마다 실행
    public void updateRankings() {
        updatePointsRanking();
        updateReadingRanking();
    }

    private void updatePointsRanking() {
        List<Users> topUsers = userRepository.findTop10ByOrderByExperienceDesc();
        ZSetOperations<String, String> zSetOps = redisTemplate.opsForZSet();

        zSetOps.removeRange(POINTS_RANK_KEY, 0, -1); // 기존 랭킹 삭제
        for (Users user : topUsers) {
            zSetOps.add(POINTS_RANK_KEY, user.getUserId().toString(), user.getExperience());
        }
    }

    private void updateReadingRanking() {
        List<Users> topUsers = userRepository.findTop10ByOrderByTotalNewsReadCountDesc();
        ZSetOperations<String, String> zSetOps = redisTemplate.opsForZSet();

        zSetOps.removeRange(READING_RANK_KEY, 0, -1); // 기존 랭킹 삭제
        for (Users user : topUsers) {
            zSetOps.add(READING_RANK_KEY, user.getUserId().toString(), user.getTotalNewsReadCount());
        }
    }

    @Override
    public List<PointsRankDTO> getRealtimeTopPointUsers() {
        Set<ZSetOperations.TypedTuple<String>> rangeWithScores =
                redisTemplate.opsForZSet().reverseRangeWithScores(POINTS_RANK_KEY, 0, TOP_RANK_COUNT - 1);

        List<PointsRankDTO> result = new ArrayList<>();
        int rank = 1;
        for (ZSetOperations.TypedTuple<String> tuple : rangeWithScores) {
            Long userId = Long.parseLong(tuple.getValue());
            Users user = userRepository.findUserByUserId(userId);
            result.add(PointsRankDTO.builder()
                    .userId(userId)
                    .nickname(user.getNickname())
                    .experience((int) tuple.getScore().doubleValue())
                    .ranking(rank++)
                    .build());
        }
        return result;
    }

    @Override
    public List<ReadingRankDTO> getRealtimeTopReaderUsers() {
        Set<ZSetOperations.TypedTuple<String>> rangeWithScores =
                redisTemplate.opsForZSet().reverseRangeWithScores(READING_RANK_KEY, 0, TOP_RANK_COUNT - 1);

        List<ReadingRankDTO> result = new ArrayList<>();
        int rank = 1;
        for (ZSetOperations.TypedTuple<String> tuple : rangeWithScores) {
            Long userId = Long.parseLong(tuple.getValue());
            Users user = userRepository.findUserByUserId(userId);
            result.add(ReadingRankDTO.builder()
                    .userId(userId)
                    .nickname(user.getNickname())
                    .totalNewsReadCount((int) tuple.getScore().doubleValue())
                    .ranking(rank++)
                    .build());
        }
        return result;
    }

    @Override
    public void updateUserPoints(Long userId, int points) {
        Users user = userRepository.findUserByUserId(userId);
        user.setExperience(user.getExperience() + points);
        userRepository.save(user);
        updatePointsRanking(); // 랭킹 즉시 업데이트
    }

    @Override
    public void updateUserReadCount(Long userId, int readCount) {
        Users user = userRepository.findUserByUserId(userId);
        user.setTotalNewsReadCount(user.getTotalNewsReadCount() + readCount);
        userRepository.save(user);
        updateReadingRanking(); // 랭킹 즉시 업데이트
    }

    @Scheduled(cron = "0 0 1 * * ?") // 매일 새벽 1시에 실행
    @Transactional
    public void syncRankingToMySQL() {
        LocalDate today = LocalDate.now();
        syncPointsRankingToMySQL(today);
        syncReadingRankingToMySQL(today);
        log.info("Daily ranking synchronization to MySQL completed.");
    }

    private void syncPointsRankingToMySQL(LocalDate date) {
        List<PointsRankDTO> pointsRanking = getRealtimeTopPointUsers();
        rankRepository.deleteByRankingTypeAndMonth("points", date);
        for (PointsRankDTO rank : pointsRanking) {
            UserRank userRank = new UserRank();
            userRank.setUser(userRepository.findUserByUserId(rank.getUserId()));
            userRank.setRankingType("points");
            userRank.setRanking(rank.getRanking());
            userRank.setScore(rank.getExperience());
            userRank.setMonth(date);
            rankRepository.save(userRank);
        }
    }

    private void syncReadingRankingToMySQL(LocalDate date) {
        List<ReadingRankDTO> readingRanking = getRealtimeTopReaderUsers();
        rankRepository.deleteByRankingTypeAndMonth("reading", date);
        for (ReadingRankDTO rank : readingRanking) {
            UserRank userRank = UserRank.builder()
                    .user(userRepository.findUserByUserId(rank.getUserId()))
                    .rankingType("reading")
                    .ranking((int) rank.getRanking())
                    .score(rank.getTotalNewsReadCount())
                    .month(date)
                    .build();
        }
    }

    public List<UserRank> getHistoricalRanking(String rankingType, LocalDate date) {
        return rankRepository.findByRankingTypeAndMonthOrderByRankingAsc(rankingType, date);
    }

    @Transactional
    public void recoverRedisFromMySQL() {
        LocalDate lastSyncDate = rankRepository.findMaxMonth();
        List<UserRank> lastPointsRanking = rankRepository.findByRankingTypeAndMonthOrderByRankingAsc("points", lastSyncDate);
        List<UserRank> lastReadingRanking = rankRepository.findByRankingTypeAndMonthOrderByRankingAsc("reading", lastSyncDate);

        ZSetOperations<String, String> zSetOps = redisTemplate.opsForZSet();

        zSetOps.removeRange(POINTS_RANK_KEY, 0, -1);
        zSetOps.removeRange(READING_RANK_KEY, 0, -1);

        for (UserRank rank : lastPointsRanking) {
            zSetOps.add(POINTS_RANK_KEY, rank.getUser().getUserId().toString(), rank.getScore());
        }

        for (UserRank rank : lastReadingRanking) {
            zSetOps.add(READING_RANK_KEY, rank.getUser().getUserId().toString(), rank.getScore());
        }

        log.info("Redis ranking data recovered from MySQL.");
    }
}