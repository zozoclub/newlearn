import React from "react";
import styled from "styled-components";

interface GoalChartBarProps {
  title: string;
  current: number;
  goal: number;
  percentage: number;
}

const GoalChartBar: React.FC<GoalChartBarProps> = ({
  title,
  current,
  goal,
  percentage,
}) => {
  return (
    <BarContainer>
      <GoalItem>
        <div>{title}</div>
        <div>{`${current} / ${goal}`}</div>
      </GoalItem>
      <GoalBarContainer>
        <GoalBarFill width={percentage} />
      </GoalBarContainer>
    </BarContainer>
  );
};

export default GoalChartBar;

const BarContainer = styled.div`
  margin: 2.5rem 0rem;
  font-size: 1.25rem;
  font-weight: bold;
`;

const GoalItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 1rem;
`;

const GoalBarContainer = styled.div`
  width: 100%;
  height: 1.25rem;
  background-color: #e0e0e0;
  border-radius: 5px;
  overflow: hidden;
`;

const GoalBarFill = styled.div<{ width: number }>`
  width: ${(props) => props.width}%;
  height: 1.25rem;
  background-color: ${(props) => props.theme.colors.primary};
  transition: width 0.5s ease-in-out;
`;
