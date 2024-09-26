import React, { useState } from "react";
import styled, { useTheme } from "styled-components";
import { Line } from "react-chartjs-2";
import SpeakingTestHistoryCardList from "@components/testpage/SpeakingTestHistoryCardList";
import Spinner from "@components/Spinner";
import { getPronounceTestResultList, PronounceTestResultListDto } from "@services/testService";
import { useQuery } from "@tanstack/react-query";
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

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

const SpeakingTestHistory: React.FC = () => {
  const { isLoading, data, error } = useQuery({
    queryKey: ['speakingTestHistory'],
    queryFn: () => getPronounceTestResultList(),
  });

  const [wordNum] = useState<number>(89);
  const average = 90;
  const theme = useTheme();

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
          <Line data={dateData} options={options} />
        </ChartContainer>
      </Layout>

      {/* 고정된 높이 및 스크롤 가능한 영역 */}
      <ScrollableTestHistoryList>
        {data?.map((test: PronounceTestResultListDto, index: number) => (
          <SpeakingTestHistoryCardList
            score={test.totalScore}
            date={formatDate(test.createdAt)} // 날짜 포맷 적용
            key={index}
          />
        ))}
      </ScrollableTestHistoryList>
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
`;

const ErrorText = styled.div`
  color: ${(props) => props.theme.colors.danger};
  font-size: 1.25rem;
  text-align: center;
`;