import React, { useEffect, useState } from "react";
import styled, { useTheme } from "styled-components";
import { Line } from "react-chartjs-2";
import SpeakingTestHistoryCardList from "@components/testpage/SpeakingTestHistoryCardListMobile";
import Spinner from "@components/Spinner";
import {
  getPronounceTestResultList,
  PronounceTestResultListDto,
} from "@services/speakingTestService";
import { useQuery } from "@tanstack/react-query";
import { useMediaQuery } from "react-responsive";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import SpeakingTestHistoryCardListMobile from "@components/testpage/SpeakingTestHistoryCardListMobile";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const SpeakingTestHistory: React.FC = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const { isLoading, data, error } = useQuery({
    queryKey: ["speakingTestHistory"],
    queryFn: () => getPronounceTestResultList(),
  });

  const [currentCount, setCurrentCount] = useState(0); // 이번 달 평가 횟수
  const [monthAgoScoreAverage, setMonthAgoScoreAverage] = useState(0); // 이전 5개월간 음성 평가 평균
  const [monthCurrentScoreAverage, setMonthCurrentScoreAverage] = useState(0); // 현재 월 음성 평가 평균

  const theme = useTheme();

  const chartformatDate = (createdAt: string) => {
    const date = new Date(createdAt);
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // 월을 2자리로 표시
    return `${month}월`; // 예: 09월
  };

  // 최근 6개월 데이터 필터링
  const getSixMonthsData = (data: PronounceTestResultListDto[]) => {
    const currentDate = new Date();
    const sixMonthsAgo = new Date(
      currentDate.setMonth(currentDate.getMonth() - 6)
    );

    const monthData: {
      [key: string]: { totalScore: number; totalCount: number };
    } = {};
    data?.forEach((quiz) => {
      const quizData = new Date(quiz.createdAt);
      if (quizData >= sixMonthsAgo) {
        const monthKey = chartformatDate(quiz.createdAt);

        // 데이터 없을때 처리
        if (!monthData[monthKey]) {
          monthData[monthKey] = { totalScore: 0, totalCount: 0 };
        }

        monthData[monthKey].totalScore += quiz.totalScore;
        monthData[monthKey].totalCount += 1;
      }
    });
    return monthData;
  };

  useEffect(() => {
    if (data) {
      let count = 0;
      let wholeSum = 0;

      data.forEach((quiz) => {
        count += 1;
        wholeSum += quiz.totalScore;
      });

      setCurrentCount(count);
      setMonthCurrentScoreAverage(wholeSum / count);
    }
  }, [data]);

  // 최근 6개월의 월을 미리 생성 (현재 월을 기준으로)
  const generateLastSixMonthsLabels = (): string[] => {
    const labels = [];
    const currentDate = new Date();

    for (let i = 5; i >= 0; i--) {
      const pastDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1
      );
      const monthKey = `${(pastDate.getMonth() + 1)
        .toString()
        .padStart(2)}월`;
      labels.push(monthKey);
    }
    return labels;
  };

  const monthLabels = generateLastSixMonthsLabels(); // 최근 6개월의 월 레이블

  const recentSixMonthsData = data ? getSixMonthsData(data) : {};

  // 시간 포맷
  const formatDate = (createdAt: string) => {
    const date = new Date(createdAt);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);

    return `${year}.${month}.${day} ${hours}:${minutes}`;
  };

  // 데이터를 carddata 형식으로 변환
  const cardData =
    data?.map((quiz) => ({
      quizId: quiz.audioFileId,
      date: formatDate(quiz.createdAt),
      score: quiz.totalScore, // 정답 비율을 점수로 변환
    })) || [];

  // 월별 데이터를 배열로 변환하여 차트 데이터에 사용
  const correctPercentagePerMonth = monthLabels.map(
    (month) =>
      recentSixMonthsData[month]?.totalScore /
        recentSixMonthsData[month]?.totalCount || 0 // 데이터가 없으면 0으로 채움
  );

  // 현재 월 제외한 이전 5개월의 학습한 단어수(totalCnt) 평균 계산
  useEffect(() => {
    if (correctPercentagePerMonth.length > 1) {
      const previousFiveMonthsData = correctPercentagePerMonth.slice(0, 5); // 현재 월 제외한 5개월 데이터
      const totalAverage =
        previousFiveMonthsData.reduce((acc, curr) => acc + curr, 0) /
        previousFiveMonthsData.length;
      setMonthAgoScoreAverage(Math.floor(totalAverage)); // 평균 값을 정수로 설정
    }
  }, [correctPercentagePerMonth]);

  const dateData = {
    labels: monthLabels, // X축
    datasets: [
      {
        label: "월별 데이터",
        data: correctPercentagePerMonth, // Y축 데이터
        borderColor: theme.colors.primary, // 라인 색상
        pointBackgroundColor: theme.colors.primaryPress, // 꼭지점 하이라이트 색상
        pointBorderColor: "#fff", // 꼭지점 테두리 색상
        pointHoverRadius: 7, // 꼭지점 하이라이트 크기
        pointHoverBackgroundColor: theme.colors.primary, // 하이라이트된 꼭지점의 색상
        tension: 0.3, // 선 (기울기)
      },
    ],
  };

  const options = {
    scales: {
      x: {
        display: true,
        title: {
          display: false, // X축 제목 숨기기
        },
        grid: {
          display: false, // X축 그리드 라인 숨기기
        },
        ticks: {
          font: {
            size: 16, // 폰트 크기 설정 
          },
          color: "#999",
        },
      },
      y: {
        display: false, // Y축 숨기기
      },
    },
    plugins: {
      legend: {
        display: false, // 레이블 숨기기
      },
    },
    elements: {
      point: {
        radius: 5, // 기본 꼭지점 크기
      },
    },
  };

  // 로딩 중일 때 Spinner 표시
  if (isLoading) return <Spinner />;

  // 에러 메시지 표시
  if (error)
    return <ErrorText>에러가 발생했습니다. 다시 시도해 주세요.</ErrorText>;

  // 모바일 페이지
  if (isMobile) {
    return (
      <>
        {data?.length === 0 ? (
          <EmptyMessage>첫 테스트를 진행해보세요!</EmptyMessage>
        ) : (
          <>
            <InfoContainer>
              <MobileTitleText>
                최근 점수보다{" "}
                {monthCurrentScoreAverage ? (
                  monthCurrentScoreAverage >= monthAgoScoreAverage ? (
                    <InfoTextEmphasizeBlue>증가</InfoTextEmphasizeBlue>
                  ) : (
                    <InfoTextEmphasizeRed>감소</InfoTextEmphasizeRed>
                  )
                ) : null}{" "}
                했어요.
              </MobileTitleText>
              <InfoText>
              {new Date().getMonth() + 1}에 학습된 발음 평균 점수 :
                {monthCurrentScoreAverage >= monthAgoScoreAverage ? (
                  <InfoTextEmphasizeBlue>
                    {Math.floor(monthCurrentScoreAverage)}
                  </InfoTextEmphasizeBlue>
                ) : (
                  <InfoTextEmphasizeRed>
                    {Math.floor(monthCurrentScoreAverage)}
                  </InfoTextEmphasizeRed>
                )}
                점
              </InfoText>
              <StatsHistory>
                <StatItem>이번 달 테스트 횟수: {currentCount}회</StatItem>
                <StatItem>
                  이번 달 평균 점수: {Math.floor(monthCurrentScoreAverage)}점
                </StatItem>
                <StatItem>
                  최근 평균 점수: {Math.floor(monthAgoScoreAverage)}점
                </StatItem>
              </StatsHistory>
            </InfoContainer>
            <ChartContainer>
              <Line data={dateData} options={options} />
            </ChartContainer>
          </>
        )}
        {/* 고정된 높이 및 스크롤 가능한 영역 */}
        {cardData.length === 0 ? (
          <EmptyMessage>테스트 진행하면 리스트들이 출력됩니다.</EmptyMessage>
        ) : (
          <ScrollableTestHistoryList>
            {data?.map((test: PronounceTestResultListDto, index: number) => (
              <SpeakingTestHistoryCardListMobile
                audioFileId={test.audioFileId}
                date={formatDate(test.createdAt)}
                key={index}
                totalScore={test.totalScore}
                accuracyScore={test.accuracyScore}
                fluencyScore={test.fluencyScore}
                prosodyScore={test.prosodyScore}
                completenessScore={test.completenessScore}
              />
            ))}
          </ScrollableTestHistoryList>
        )}
      </>
    );
  }

  return (
    <MainContainer>
      <Layout>
        {data?.length === 0 ? (
          <EmptyMessage>첫 테스트를 진행해보세요!</EmptyMessage>
        ) : (
          <>
            <InfoContainer>
              <TitleText>
                최근 점수보다{" "}
                {monthCurrentScoreAverage ? (
                  monthCurrentScoreAverage >= monthAgoScoreAverage ? (
                    <InfoTextEmphasizeBlue>증가</InfoTextEmphasizeBlue>
                  ) : (
                    <InfoTextEmphasizeRed>감소</InfoTextEmphasizeRed>
                  )
                ) : null}{" "}
                했어요.
              </TitleText>
              <InfoText>
              {new Date().getMonth() + 1}에 학습된 발음 평균 점수 :
                {monthCurrentScoreAverage ? (
                  monthCurrentScoreAverage >= monthAgoScoreAverage ? (
                    <InfoTextEmphasizeBlue>
                      {Math.floor(monthCurrentScoreAverage)}
                    </InfoTextEmphasizeBlue>
                  ) : (
                    <InfoTextEmphasizeRed>
                      {Math.floor(monthCurrentScoreAverage)}
                    </InfoTextEmphasizeRed>
                  )
                ) : null}
                점
              </InfoText>
              <StatsHistory>
                <StatItem>이번 달 테스트 횟수: {currentCount}회</StatItem>
                <StatItem>
                  이번 달 평균 점수: {Math.floor(monthCurrentScoreAverage)}점
                </StatItem>
                <StatItem>
                  최근 평균 점수: {Math.floor(monthAgoScoreAverage)}점
                </StatItem>
              </StatsHistory>
            </InfoContainer>

            <ChartContainer>
              <Line data={dateData} options={options} />
            </ChartContainer>
          </>
        )}
      </Layout>

      {/* 고정된 높이 및 스크롤 가능한 영역 */}
      {cardData.length === 0 ? (
        <EmptyMessage>테스트 진행하면 리스트들이 출력됩니다.</EmptyMessage>
      ) : (
        <ScrollableTestHistoryList>
          {data?.map((test: PronounceTestResultListDto, index: number) => (
            <SpeakingTestHistoryCardList
              audioFileId={test.audioFileId}
              date={formatDate(test.createdAt)}
              key={index}
              totalScore={test.totalScore}
              accuracyScore={test.accuracyScore}
              fluencyScore={test.fluencyScore}
              prosodyScore={test.prosodyScore}
              completenessScore={test.completenessScore}
            />
          ))}
        </ScrollableTestHistoryList>
      )}
    </MainContainer>
  );
};

export default SpeakingTestHistory;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 2rem;
  box-sizing: border-box;
`;

const Layout = styled.div`
  display: flex;
  justify-content: space-between;
  width: 90%;
  margin: 0 auto;
  margin-bottom: 2rem;
`;

const InfoContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

const ChartContainer = styled.div`
  width: 100%;
  padding-top: 1rem;
  margin-bottom: 2rem;
  justify-content: center;
`;

const TitleText = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;

  @media (max-width: 1280px) {
    font-size: 1.25rem; /* 1280px 이하일 때 글씨 크기를 줄임 */
  }
`;

const InfoText = styled.p`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;

  @media (max-width: 1280px) {
    font-size: 1rem; /* 1280px 이하일 때 글씨 크기를 줄임 */
  }
`;

const InfoTextEmphasizeRed = styled.span`
  margin-left: 0.25rem;
  font-size: 2rem;
  color: ${(props) => props.theme.colors.danger};

  @media (max-width: 1280px) {
    font-size: 1.5rem; /* 1280px 이하일 때 글씨 크기를 줄임 */
  }
`;

const InfoTextEmphasizeBlue = styled.span`
  margin-left: 0.25rem;
  font-size: 2rem;
  color: ${(props) => props.theme.colors.primary};

  @media (max-width: 1280px) {
    font-size: 1.5rem; /* 1280px 이하일 때 글씨 크기를 줄임 */
  }
`;
const StatsHistory = styled.div`
  display: flex;
  flex-direction: column;
`;

const StatItem = styled.p`
  font-size: 1rem;
  margin-bottom: 0.5rem;
  @media (max-width: 1280px) {
    font-size: 0.875rem;
  }
  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const ScrollableTestHistoryList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  max-height: 24rem;
  width: 100%;
  overflow-y: auto; /* 세로 스크롤 가능 */
  overflow-x: hidden; /* 좌우 스크롤 제거 */
  padding-top: 1rem;
`;

const ErrorText = styled.div`
  color: ${(props) => props.theme.colors.danger};
  font-size: 1.25rem;
  text-align: center;
`;

const EmptyMessage = styled.p`
  margin-top: 5rem;
  justify-content: center;
  margin: auto;
  padding-top: 10rem;
  text-align: center;
  font-size: 1.25rem;
  color: ${(props) => props.theme.colors.text04};
`;

// 모바일전용
const MobileTitleText = styled.h1`
  font-size: 1.25rem;
  font-weight: 700;
  margin-top: 2rem;
  margin-bottom: 1rem;
`;
