import styled, { useTheme } from "styled-components";
import { Doughnut } from "react-chartjs-2";
import { ChartOptions } from "chart.js";
import { StudyProgressProps } from "@services/goalService";

const GoalChart: React.FC<{ studyProgress: StudyProgressProps }> = ({
  studyProgress,
}) => {
  const perReadNewsCount =
    (studyProgress.currentReadNewsCount / studyProgress.goalReadNewsCount) *
    100;
  const perCompleteWord =
    (studyProgress.currentCompleteWord / studyProgress.goalCompleteWord) * 100;
  const perPronounceTestScore =
    (studyProgress.currentPronounceTestScore /
      studyProgress.goalPronounceTestScore) *
    100;
  const perAverage = Math.min(
    (perReadNewsCount + perCompleteWord + perPronounceTestScore) / 3,
    100
  );
  const displayPerAverage =
    perAverage >= 100 ? "COMPLETE" : `${perAverage.toFixed(2)}%`;

  const theme = useTheme();
  const fillColor = theme.colors.primary;
  const emptyColor = theme.colors.cancel;

  const doughnutData = {
    datasets: [
      {
        data: [perAverage, 100 - perAverage],
        backgroundColor: [fillColor, emptyColor],
        borderWidth: 0,
        cutout: "70%",
      },
    ],
  };

  const doughnutOptions: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
  };

  return (
    <div>
      <ChartContainer>
        <TitleContainer>
          <NicknameContainer>뉴런영어</NicknameContainer> 님의 학습 현황
        </TitleContainer>
        {/* 도넛 차트 */}
        <DoughnutContainer>
          <Doughnut data={doughnutData} options={doughnutOptions} />
          <DoughnutText>{displayPerAverage}</DoughnutText>
        </DoughnutContainer>
        {/* 뉴스 읽기 */}
        <BarContainer>
          <GoalItem>
            <div>뉴스 읽기</div>
            <div>{`${studyProgress.currentReadNewsCount} / ${studyProgress.goalReadNewsCount}`}</div>
          </GoalItem>
          <GoalBarContainer>
            <GoalBarFill width={perReadNewsCount} />
          </GoalBarContainer>
        </BarContainer>
        {/* 단어 테스트 */}
        <BarContainer>
          <GoalItem>
            <div>단어 테스트</div>
            <div>{`${studyProgress.currentCompleteWord} / ${studyProgress.goalCompleteWord}`}</div>
          </GoalItem>
          <GoalBarContainer>
            <GoalBarFill width={perCompleteWord} />
          </GoalBarContainer>
        </BarContainer>
        {/* 발음 테스트 */}
        <BarContainer>
          <GoalItem>
            <div>발음 테스트</div>
            <div>{`${studyProgress.currentPronounceTestScore} / ${studyProgress.goalPronounceTestScore}`}</div>
          </GoalItem>
          <GoalBarContainer>
            <GoalBarFill width={perPronounceTestScore} />
          </GoalBarContainer>
        </BarContainer>
      </ChartContainer>
    </div>
  );
};

export default GoalChart;

const TitleContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 1rem 0 2rem;
  font-size: 1.25rem;
`;

const NicknameContainer = styled.div`
  font-size: 1.375rem;
  font-weight: bold;
`;
const ChartContainer = styled.div`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
`;

const DoughnutContainer = styled.div`
  position: relative;
  width: 380px;
  height: 180px;
`;

const DoughnutText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  color: ${(props) => props.theme.colors.primary};
  font-size: 1.25rem;
  font-weight: bold;
  transform: translate(-50%, -50%);
`;

const GoalItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0.75rem 0;
`;

// Bar
const BarContainer = styled.div`
  margin: 1.5rem 0;
`;

const GoalBarContainer = styled.div`
  width: 100%;
  height: 1.25rem;
  background-color: ${(props) => props.theme.colors.cancel};
  border-radius: 5px;
  overflow: hidden;
`;

const GoalBarFill = styled.div<{ width: number }>`
  width: ${(props) => props.width}%;
  height: 1.25rem;
  background-color: ${(props) => props.theme.colors.primary};
  transition: width 0.5s ease-in-out;
`;
