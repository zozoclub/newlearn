import React, { useState } from "react";
import styled, { useTheme } from "styled-components";
import { Line } from "react-chartjs-2";

import WordTestHistoryCardList from "@components/testPage/WordTestHistoryCardList";

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

const WordTestHistory: React.FC = () => {
  const [wordNum] = useState<number>(89);
  const average = 90;
  const theme = useTheme(); // styled-components의 테마에 접근

  const data = {
    labels: ["3월", "4월", "5월", "6월", "7월", "8월", "9월"], // X축
    datasets: [
      {
        label: "월별 데이터",
        data: [20, 45, 30, 55, 80, 60, 90], // Y축 데이터
        borderColor: theme.colors.primary, // 라인 색상
        pointBackgroundColor: theme.colors.primaryPress, // 꼭지점 하이라이트 색상
        pointBorderColor: "#fff", // 꼭지점 테두리 색상
        pointHoverRadius: 7, // 꼭지점 하이라이트 크기
        pointHoverBackgroundColor: theme.colors.secondaryPress, // 하이라이트된 꼭지점의 색상
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

  const carddata = [
    {
      date: "2024.09.09",
      score: 85,
    },
    {
      date: "2024.09.09",
      score: 72,
    },
    {
      date: "2024.09.09",
      score: 53,
    },
    {
      date: "2024.09.09",
      score: 68,
    },
    {
      date: "2024.09.09",
      score: 97,
    },
    {
      date: "2024.09.09",
      score: 77,
    },
    {
      date: "2024.09.09",
      score: 85,
    },
    {
      date: "2024.09.09",
      score: 96,
    },
  ];

  return (
    <MainContainer>
      <Layout>
        <InfoContainer>
          <TitleText>최근 평균보다 많이 학습했어요!</TitleText>
          <InfoText>
            9월에 학습된 단어 개수 :
            {wordNum ? (
              wordNum >= average ? (
                <InfoTextEmphasizeBlue>{wordNum}</InfoTextEmphasizeBlue>
              ) : (
                <InfoTextEmphasizeRed>{wordNum}</InfoTextEmphasizeRed>
              )
            ) : null}
          </InfoText>
          <StatsHistory>
            <StatItem>테스트 횟수: 5회</StatItem>
            <StatItem>맞춘 단어수: 80개</StatItem>
            <StatItem>틀린 단어수: 10개</StatItem>
          </StatsHistory>
        </InfoContainer>

        <ChartContainer>
          <Line data={data} options={options} />
        </ChartContainer>
      </Layout>

      {/* 고정된 높이 및 스크롤 가능한 영역 */}
      <ScrollableTestHistoryList>
        {carddata.map((data, index) => {
          return (
            <WordTestHistoryCardList
              score={data.score}
              date={data.date}
              key={index}
            />
          );
        })}
      </ScrollableTestHistoryList>
    </MainContainer>
  );
};

export default WordTestHistory;

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
  width: 100%;
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
  justify-content: center;
`;

const TitleText = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const InfoText = styled.p`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
`;

const InfoTextEmphasizeRed = styled.span`
  margin-left: 0.25rem;
  font-size: 2rem;
  color: #ff6573;
`;

const InfoTextEmphasizeBlue = styled.span`
  margin-left: 0.25rem;
  font-size: 2rem;
  color: ${(props) => props.theme.colors.primary};
`;

const StatsHistory = styled.div`
  display: flex;
  flex-direction: column;
`;

const StatItem = styled.p`
  font-size: 1rem;
  margin-bottom: 0.5rem;
`;

const ScrollableTestHistoryList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  width: 100%;
  max-height: 300px;
  overflow-y: auto; /* 세로 스크롤 가능 */
  overflow-x: hidden; /* 좌우 스크롤 제거 */
  padding-top: 1rem;
  padding-right: 1rem;
`;
