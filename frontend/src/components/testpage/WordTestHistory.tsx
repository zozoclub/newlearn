import React, { useEffect, useState } from "react";
import styled, { useTheme } from "styled-components";
import { Line } from "react-chartjs-2";
import WordTestHistoryCardList from "@components/testpage/WordTestHistoryCardList";
import {
  getWordTestResultList,
  WordTestResultListResponse,
} from "@services/wordTestService";
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

const WordTestHistory: React.FC = () => {
  const [correctCount, setCorrectCount] = useState(0);
  const [currentCount, setCurrentCount] = useState(0); // 이번 달 평가 횟수
  const [wholeCount, setWholeCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [monthAverage, setMonthAverage] = useState(0); // 이전 5개월간 단어 학습 평균 갯수
  const theme = useTheme();

  const { isLoading, data, error } = useQuery({
    queryKey: ["wordTestHistory"],
    queryFn: () => getWordTestResultList(),
  });
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
  const chartformatDate = (createdAt: string) => {
    const date = new Date(createdAt);
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // 월을 2자리로 표시
    return `${month}월`; // 예: 09월
  };

  // 최근 6개월 데이터 필터링
  const getSixMonthsData = (data: WordTestResultListResponse[]) => {
    const currentDate = new Date();
    const sixMonthsAgo = new Date(
      currentDate.setMonth(currentDate.getMonth() - 6)
    );

    const monthData: { [key: string]: { correct: number; total: number } } = {};
    data?.forEach((quiz) => {
      const quizData = new Date(quiz.createdAt);
      if (quizData >= sixMonthsAgo) {
        const monthKey = chartformatDate(quiz.createdAt);

        // 데이터 없을때 처리
        if (!monthData[monthKey]) {
          monthData[monthKey] = { correct: 0, total: 0 };
        }

        monthData[monthKey].correct += quiz.correctCnt;
        monthData[monthKey].total += quiz.totalCnt;
      }
    });
    return monthData;
  };

  useEffect(() => {
    if (data) {
      let correctSum = 0;
      let wholeSum = 0;
      let count = 0;

      data.forEach((quiz) => {
        correctSum += quiz.correctCnt;
        wholeSum += quiz.totalCnt;
        count += 1;
      });

      setCorrectCount(correctSum);
      setWholeCount(wholeSum);
      setWrongCount(wholeSum - correctSum);
      setCurrentCount(count);
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
        .padStart(2, "0")}월`;
      labels.push(monthKey);
    }
    return labels;
  };

  const monthLabels = generateLastSixMonthsLabels(); // 최근 6개월의 월 레이블

  const recentSixMonthsData = data ? getSixMonthsData(data) : {};

  // 월별 데이터를 배열로 변환하여 차트 데이터에 사용
  const correctPercentagePerMonth = monthLabels.map(
    (month) => recentSixMonthsData[month]?.total || 0 // 데이터가 없으면 0으로 채움
  );

  // 현재 월 제외한 이전 5개월의 학습한 단어수(totalCnt) 평균 계산
  useEffect(() => {
    if (correctPercentagePerMonth.length > 1) {
      const previousFiveMonthsData = correctPercentagePerMonth.slice(0, 5); // 현재 월 제외한 5개월 데이터
      const totalAverage =
        previousFiveMonthsData.reduce((acc, curr) => acc + curr, 0) /
        previousFiveMonthsData.length;
      setMonthAverage(Math.floor(totalAverage)); // 평균 값을 정수로 설정
    }
  }, [correctPercentagePerMonth]);

  const dateData = {
    labels: monthLabels, // X축 최신화
    datasets: [
      {
        label: "최근 6개월 학습 단어수",
        data: correctPercentagePerMonth, // Y축 최신화
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
  if (error)
    return <ErrorText>에러가 발생했습니다. 다시 시도해 주세요.</ErrorText>;

  return (
    <MainContainer>
      <Layout>
        {data?.length === 0 ? (
          <EmptyMessage>첫 테스트를 진행해보세요!</EmptyMessage>
        ) : (
          <>
            <InfoContainer>
              <TitleText>
                최근 평균보다{" "}
                {wholeCount ? (
                  wholeCount >= monthAverage ? (
                    <InfoTextEmphasizeBlue>많이</InfoTextEmphasizeBlue>
                  ) : (
                    <InfoTextEmphasizeRed>적게</InfoTextEmphasizeRed>
                  )
                ) : null}{" "}
                학습했어요.
              </TitleText>
              <InfoText>
                {new Date().getMonth() + 1}월에 학습된 단어 개수 :
                {wholeCount ? (
                  wholeCount >= monthAverage ? (
                    <InfoTextEmphasizeBlue>{wholeCount}</InfoTextEmphasizeBlue>
                  ) : (
                    <InfoTextEmphasizeRed>{wholeCount}</InfoTextEmphasizeRed>
                  )
                ) : null}
              </InfoText>
              <StatsHistory>
                <StatItem>테스트 횟수: {currentCount}회</StatItem>
                <StatItem>맞춘 단어수: {correctCount}개</StatItem>
                <StatItem>틀린 단어수: {wrongCount}개</StatItem>
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
        <EmptyMessage>테스트를 진행하면 리스트들이 출력됩니다.</EmptyMessage>
      ) : (
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
      )}
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
  color: ${(props) => props.theme.colors.danger};
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

const ErrorText = styled.div`
  color: ${(props) => props.theme.colors.danger};
  font-size: 1.25rem;
  text-align: center;
`;

const EmptyMessage = styled.p`
  display: flex; 
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  height: 100%;
  margin-top: 5rem;
  justify-content: center;
  text-align: center;
  font-size: 1.25rem;
  color: ${(props) => props.theme.colors.text04};
`;
