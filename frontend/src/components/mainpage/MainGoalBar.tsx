import React from "react";
import styled from "styled-components";
import { useRecoilValue } from "recoil";
import { goalDataSelector, useStudyProgress } from "@store/goalState";
import Spinner from "@components/Spinner";

interface GoalData {
  title: string;
  current: number;
  goal: number;
}

const titleMapping: { [key: string]: string } = {
  "뉴스 읽기": "read",
  "단어 테스트": "word",
  "발음 테스트": "speak",
};

const MainGoalBar: React.FC = () => {
  const { isLoading } = useStudyProgress();
  const goalData = useRecoilValue(goalDataSelector);

  const calculatePercentage = (current: number, goal: number): number => {
    return Math.min(Math.round((current / goal) * 100), 100);
  };

  if (isLoading)
    return (
      <div>
        <Spinner />
      </div>
    );

  return (
    <ChartContainer>
      <TitleContainer>{new Date().getMonth() + 1}월 학습 현황</TitleContainer>
      <BarItemsContainer>
        {goalData.map((item: GoalData, index: number) => {
          const percentage = calculatePercentage(item.current, item.goal);
          const englishTitle = titleMapping[item.title] || item.title;
          const current = item.current;
          const goal = item.goal;
          return (
            <BarItem key={index}>
              <BarTitle>
                <BarLabel>{englishTitle}</BarLabel>
                <BarNumber>
                  {current} / {goal}
                </BarNumber>
              </BarTitle>
              <BarContainer>
                <BarFill $percentage={percentage} />
              </BarContainer>
            </BarItem>
          );
        })}
      </BarItemsContainer>
    </ChartContainer>
  );
};

export default MainGoalBar;

const ChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90%;
  padding: 3% 0;
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
  font-size: 1.25rem;
  font-weight: bold;
`;

const BarItemsContainer = styled.div`
  width: 100%;
`;

const BarTitle = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0 0.25rem;
  max-height: 40px;
`;

const BarContent = styled.div`
  width: 4rem;
  margin: 0.875rem 0;
  font-weight: bold;
`;

const BarLabel = styled(BarContent)`
  text-align: left;
`;

const BarNumber = styled(BarContent)`
  min-width: 70px;
  text-align: right;
`;

const BarContainer = styled.div`
  width: 100%;
  height: 0.75rem;
  background-color: #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
`;
const BarItem = styled.div`
  margin: 0.5rem 0.25rem;
  gap: 0.5rem;
`;
const BarFill = styled.div<{ $percentage: number }>`
  width: ${(props) => props.$percentage}%;
  height: 100%;
  background-color: ${(props) => props.theme.colors.primary};
  transition: width 0.5s ease-in-out;
`;
