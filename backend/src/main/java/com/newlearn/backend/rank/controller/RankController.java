package com.newlearn.backend.rank.controller;

import com.newlearn.backend.common.ApiResponse;
import com.newlearn.backend.common.ErrorCode;
import com.newlearn.backend.rank.model.UserRank;
import com.newlearn.backend.rank.service.RankService;
import lombok.Getter;
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

    // 포인트왕 랭킹 조회
    @GetMapping("/point")
    public ApiResponse<?> getRankPoint() throws Exception {
        try {
            List<UserRank> rankUsers = rankService.getTopPointUsers();
            return ApiResponse.createSuccess(rankUsers, "포인트왕 조회 성공");
        } catch (Exception e) {
            log.error("포인트 랭킹 조회 중 오류 발생", e);
            return ApiResponse.createError(ErrorCode.POINT_RANK_NOT_FOUND);
        }
    }

    // 다독왕 랭킹 조회
    @GetMapping("/read")
    public ApiResponse<?> getRankReader() throws Exception {
        try {
            List<UserRank> rankUsers = rankService.getTopReaderUsers();
            return ApiResponse.createSuccess(rankUsers, "다독왕 조회 성공");
        } catch (Exception e) {
            log.error("뉴스 읽음 랭킹 조회 중 오류 발생", e);
            return ApiResponse.createError(ErrorCode.NEWS_READ_RANK_NOT_FOUND);
        }
    }
}
