import React from "react";
import styled, { useTheme } from "styled-components";
import { Line } from "react-chartjs-2";
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

const SpeakingTestHistory: React.FC = () => {
  // styled-components의 테마에 접근
  const theme = useTheme();

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

  return (
    <MainContainer>
      <Layout>
        <InfoContainer>
          <TitleText>최근 평균보다 많이 학습했어요!</TitleText>
          <InfoText>9월에 학습된 단어 개수: 90개</InfoText>
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
      <TestHistoryList>테스트리스트 예정</TestHistoryList>
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
  width: 100%;
  margin-bottom: 2rem;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
`;

const ChartContainer = styled.div`
  width: 50%;
`;

const TitleText = styled.h1`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const InfoText = styled.p`
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
`;

const StatsHistory = styled.div`
  display: flex;
  flex-direction: column;
`;

const StatItem = styled.p`
  font-size: 1rem;
  margin-bottom: 0.5rem;
`;

const TestHistoryList = styled.div`
  width: 100%;
  margin-top: 2rem;
`;
