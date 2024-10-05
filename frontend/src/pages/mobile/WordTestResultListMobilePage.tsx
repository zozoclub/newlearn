import React, { useState } from "react";
import styled, { useTheme } from "styled-components";
import { Line } from "react-chartjs-2";
import WordTestHistoryCardList from "@components/testpage/WordTestHistoryCardList";
import { getWordTestResultList } from "@services/wordTestService";
import { useQuery } from "@tanstack/react-query";
import Spinner from "@components/Spinner";
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

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const WordTestResultListMobilePage: React.FC = () => {
  const [wordNum] = useState<number>(89);
  const average = 90;
  const theme = useTheme();

  const { isLoading, data, error } = useQuery({
    queryKey: ['wordTestHistory'],
    queryFn: () => getWordTestResultList(),
  });

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
      quizId: quiz.quizId,
      date: formatDate(quiz.createdAt),
      score: Math.floor((quiz.correctCnt / quiz.totalCnt) * 100), // 정답 비율을 점수로 변환
    })) || [];

  const dateData = {
    labels: ["3월", "4월", "5월", "6월", "7월", "8월", "9월"], // X축
    datasets: [
      {
        label: "월별 데이터",
        data: [20, 45, 30, 55, 80, 60, 90], // Y축 데이터
        borderColor: theme.colors.primary, // 라인 색상
        pointBackgroundColor: theme.colors.primaryPress, // 꼭지점 하이라이트 색상
        pointBorderColor: "#fff", // 꼭지점 테두리 색상
        pointHoverRadius: 7, // 꼭지점 하이라이트 크기
        pointHoverBackgroundColor: theme.colors.primaryPress, // 하이라이트된 꼭지점의 색상
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
  if (error) return <ErrorText>에러가 발생했습니다. 다시 시도해 주세요.</ErrorText>;

  return (
    <MainContainer>
      <ChartContainer>
        <Line data={dateData} options={options} />
      </ChartContainer>

      <InfoContainer>
        <TitleText>최근 평균보다 많이 학습했어요!</TitleText>
        <InfoText>
          9월에 학습된 단어 개수 :
          {wordNum >= average ? (
            <InfoTextEmphasizeBlue>{wordNum}</InfoTextEmphasizeBlue>
          ) : (
            <InfoTextEmphasizeRed>{wordNum}</InfoTextEmphasizeRed>
          )}
        </InfoText>
        <StatsHistory>
          <StatItem>테스트 횟수: 5회</StatItem>
          <StatItem>맞힌 단어수: 80개</StatItem>
          <StatItem>틀린 단어수: 10개</StatItem>
        </StatsHistory>
      </InfoContainer>

      {/* 테스트 결과 리스트 */}
      <ScrollableTestHistoryList>
        {cardData.map((data, index) => (
          <WordTestHistoryCardList
            score={data.score}
            date={data.date}
            key={index}
            quizId={data.quizId}
          />
        ))}
      </ScrollableTestHistoryList>
    </MainContainer>
  );
};

export default WordTestResultListMobilePage;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1rem;
  box-sizing: border-box;
`;

const ChartContainer = styled.div`
  width: 100%;
  margin-bottom: 1rem;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  width: 100%;
  margin-bottom: 1.5rem;
`;

const TitleText = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const InfoText = styled.p`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const InfoTextEmphasizeRed = styled.span`
  font-size: 1.5rem;
  color: #ff6573;
`;

const InfoTextEmphasizeBlue = styled.span`
  font-size: 1.5rem;
  color: ${(props) => props.theme.colors.primary};
`;

const StatsHistory = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1rem;
  margin-top: 0.5rem;
`;

const StatItem = styled.p`
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
`;

const ScrollableTestHistoryList = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 400px;
  overflow-y: auto;
  padding-top: 1rem;
`;

const ErrorText = styled.div`
  color: ${(props) => props.theme.colors.danger};
  font-size: 1.25rem;
  text-align: center;
  margin-top: 2rem;
`;
