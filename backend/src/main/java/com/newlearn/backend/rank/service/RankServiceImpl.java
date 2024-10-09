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

        for (Users user : allUsers) {
            zSetOps.add(POINTS_RANK_KEY, user.getUserId().toString(), user.getExperience());
        }
    }

    private void updateReadingRanking() {
        List<Users> allUsers = userRepository.findAll();
        ZSetOperations<String, String> zSetOps = redisTemplate.opsForZSet();

        for (Users user : allUsers) {
            zSetOps.add(READING_RANK_KEY, user.getUserId().toString(), user.getTotalNewsReadCount());
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
        redisTemplate.opsForZSet().incrementScore(POINTS_RANK_KEY, userId.toString(), points);
    }

    @Override
    public void updateUserReadCount(Long userId, int readCount) {
        redisTemplate.opsForZSet().incrementScore(READING_RANK_KEY, userId.toString(), readCount);
    }
}