import React from "react";
import styled from "styled-components";
import { useRecoilValue } from "recoil";
import goalState, { goalDataSelector } from "@store/goalState";
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
  const isInitialized = useRecoilValue(goalState).isInitialized;
  const goalData = useRecoilValue(goalDataSelector);

  const calculatePercentage = (current: number, goal: number): number => {
    return Math.min(Math.round((current / goal) * 100), 100);
  };

  if (!isInitialized)
    return (
      <div>
        <Spinner />
      </div>
    );

  return (
    <ChartContainer>
      {goalData.map((item: GoalData, index: number) => {
        const percentage = calculatePercentage(item.current, item.goal);
        const englishTitle = titleMapping[item.title] || item.title;

        return (
          <BarItem key={index}>
            <BarLabel>{englishTitle}</BarLabel>
            <BarContainer>
              <BarFill $percentage={percentage} />
            </BarContainer>
          </BarItem>
        );
      })}
    </ChartContainer>
  );
};

export default MainGoalBar;

const ChartContainer = styled.div`
  width: 90%;
`;

const BarItem = styled.div`
  display: flex;
  align-items: center;
  margin: 0.75rem 0;
  gap: 0.5rem;
`;

const BarLabel = styled.div`
  width: 4rem;
  font-weight: bold;
  text-align: center;
`;

const BarContainer = styled.div`
  width: 100%;
  height: 0.75rem;
  background-color: #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
`;

const BarFill = styled.div<{ $percentage: number }>`
  width: ${(props) => props.$percentage}%;
  height: 100%;
  background-color: ${(props) => props.theme.colors.primary};
  transition: width 0.5s ease-in-out;
`;
