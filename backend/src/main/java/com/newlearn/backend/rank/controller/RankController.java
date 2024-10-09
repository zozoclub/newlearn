package com.newlearn.backend.rank.controller;

import com.newlearn.backend.common.ApiResponse;
import com.newlearn.backend.common.ErrorCode;
import com.newlearn.backend.rank.dto.PointsRankDTO;
import com.newlearn.backend.rank.dto.ReadingRankDTO;
import com.newlearn.backend.rank.service.RankService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/rank")
public class RankController {

    private final RankService rankService;

    @GetMapping("/point")
    public ApiResponse<?> getRankPoint() {
        try {
            List<PointsRankDTO> rankUsers = rankService.getRealtimeTopPointUsers();
            return ApiResponse.createSuccess(rankUsers, "실시간 포인트왕 조회 성공");
        } catch (Exception e) {
            log.error("실시간 포인트 랭킹 조회 중 오류 발생", e);
            return ApiResponse.createError(ErrorCode.POINT_RANK_NOT_FOUND);
        }
    }

    @GetMapping("/read")
    public ApiResponse<?> getRankReader() {
        try {
            List<ReadingRankDTO> rankUsers = rankService.getRealtimeTopReaderUsers();
            return ApiResponse.createSuccess(rankUsers, "실시간 다독왕 조회 성공");
        } catch (Exception e) {
            log.error("실시간 뉴스 읽음 랭킹 조회 중 오류 발생", e);
            return ApiResponse.createError(ErrorCode.NEWS_READ_RANK_NOT_FOUND);
        }
    }
}