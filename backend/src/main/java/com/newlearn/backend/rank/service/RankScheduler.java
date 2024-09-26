package com.newlearn.backend.rank.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class RankScheduler {

    @Autowired
    private RankService rankService;

//    @Scheduled(cron = "0 0 0 1 * *", zone = "Asia/Seoul") // 매월 1일 오전 12시 업데이트
    @Scheduled(cron = "0 * * * * *", zone = "Asia/Seoul")   // 개발을 위해서 1분마다 갱신
    public void updateMonthlyRankings() {
        rankService.updateRankings();
    }
}
