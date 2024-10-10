package com.newlearn.backend.rank.service;

import com.newlearn.backend.rank.dto.PointsRankDTO;
import com.newlearn.backend.rank.dto.ReadingRankDTO;
import com.newlearn.backend.user.model.Users;
import com.newlearn.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

//@RequiredArgsConstructor
@Service
@Slf4j
public class RankServiceImpl implements RankService {

    private final UserRepository userRepository;

//    @Qualifier("redisTemplateForRank")
    private final RedisTemplate<String, String> redisTemplate;

    public RankServiceImpl(UserRepository userRepository,
                           @Qualifier("redisTemplateForRank") RedisTemplate<String, String> redisTemplate) {
        this.userRepository = userRepository;
        this.redisTemplate = redisTemplate;
    }

    private static final String POINTS_RANK_KEY = "points_rank";
    private static final String READING_RANK_KEY = "reading_rank";

    @Override
    @Scheduled(fixedRate = 5000) // 5초마다 실행
    public void updateRankings() {
        updatePointsRanking();
        updateReadingRanking();
    }

    private void updatePointsRanking() {
        List<Users> allUsers = userRepository.findAll();
        ZSetOperations<String, String> zSetOps = redisTemplate.opsForZSet();

        // 모든 유저를 ZSet에 추가
        for (Users user : allUsers) {
            if (user.getUserId() != null) {
                zSetOps.add(POINTS_RANK_KEY, user.getUserId().toString(), user.getExperience());
            }
        }

        // 현재 랭킹에 있는 유저 IDs
        Set<String> currentRankedUserIds = zSetOps.range(POINTS_RANK_KEY, 0, -1);
        int currentRankCount = currentRankedUserIds.size();

        // 필요에 따라 새로운 유저 추가
        if (currentRankCount < 10) {
            int neededUsers = 10 - currentRankCount;

            // 현재 랭킹에 포함되지 않은 유저를 필터링하여 추가
            List<Users> newUsers = allUsers.stream()
                    .filter(user -> !currentRankedUserIds.contains(user.getUserId().toString()))
                    .limit(neededUsers)
                    .collect(Collectors.toList());

            for (Users user : newUsers) {
                zSetOps.add(POINTS_RANK_KEY, user.getUserId().toString(), user.getExperience());
            }
        }

        // ZSet에서 탈퇴한 유저 제거
        for (String rankedUserId : currentRankedUserIds) {
            if (!allUsers.stream().anyMatch(user -> user.getUserId().toString().equals(rankedUserId))) {
                zSetOps.remove(POINTS_RANK_KEY, rankedUserId);
            }
        }
    }

    private void updateReadingRanking() {
        List<Users> allUsers = userRepository.findAll();
        ZSetOperations<String, String> zSetOps = redisTemplate.opsForZSet();

        // 모든 유저를 ZSet에 추가
        for (Users user : allUsers) {
            if (user.getUserId() != null) {
                zSetOps.add(READING_RANK_KEY, user.getUserId().toString(), user.getTotalNewsReadCount());
            }
        }

        // 현재 랭킹에 있는 유저 IDs
        Set<String> currentRankedUserIds = zSetOps.range(READING_RANK_KEY, 0, -1);
        int currentRankCount = currentRankedUserIds.size();

        // 필요에 따라 새로운 유저 추가
        if (currentRankCount < 10) {
            int neededUsers = 10 - currentRankCount;

            // 현재 랭킹에 포함되지 않은 유저를 필터링하여 추가
            List<Users> newUsers = allUsers.stream()
                    .filter(user -> !currentRankedUserIds.contains(user.getUserId().toString()))
                    .limit(neededUsers)
                    .collect(Collectors.toList());

            for (Users user : newUsers) {
                zSetOps.add(READING_RANK_KEY, user.getUserId().toString(), user.getTotalNewsReadCount());
            }
        }

        // ZSet에서 탈퇴한 유저 제거
        for (String rankedUserId : currentRankedUserIds) {
            if (!allUsers.stream().anyMatch(user -> user.getUserId().toString().equals(rankedUserId))) {
                zSetOps.remove(READING_RANK_KEY, rankedUserId);
            }
        }
    }

    @Override
    public List<PointsRankDTO> getRealtimeTopPointUsers() {
        Set<ZSetOperations.TypedTuple<String>> rangeWithScores =
                redisTemplate.opsForZSet().reverseRangeWithScores(POINTS_RANK_KEY, 0, 9);

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
                redisTemplate.opsForZSet().reverseRangeWithScores(READING_RANK_KEY, 0, 9);

        List<ReadingRankDTO> result =  new ArrayList<>();
        int rank = 1;

        for (ZSetOperations.TypedTuple<String> tuple : rangeWithScores) {
            Long userId = Long.parseLong(tuple.getValue());
            Users user = userRepository.findUserByUserId(userId);

            result.add(ReadingRankDTO.builder()
                    .userId(userId)
                    .nickname(user.getNickname())
                    .experience((int) tuple.getScore().doubleValue())
                    .totalNewsReadCount((int) tuple.getScore().doubleValue())
                    .ranking(rank++)
                    .build());
        }

        return result;
    }

    @Override
    public void updateUserPoints(Long userId, int points) {
        redisTemplate.opsForZSet().incrementScore(POINTS_RANK_KEY, userId.toString(), points);
    }

    @Override
    public void updateUserReadCount(Long userId, int readCount) {
        redisTemplate.opsForZSet().incrementScore(READING_RANK_KEY, userId.toString(), readCount);
    }

    @Override
    public void removeUserFromRanking(Long userId) {
        String userKey = "user:" + userId;

        ZSetOperations<String, String> zSetOperations = redisTemplate.opsForZSet();
        zSetOperations.remove(POINTS_RANK_KEY, userKey);
        zSetOperations.remove(READING_RANK_KEY, userKey);
    }
}