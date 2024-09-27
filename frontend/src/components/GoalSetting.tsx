import React, { useState } from "react";
import styled from "styled-components";
import { UseMutationResult } from "@tanstack/react-query";
import { GoalSettingType } from "@services/goalService";

type GoalSettingComponentProps = {
  goalMutation: UseMutationResult<GoalSettingType, Error, GoalSettingType>;
};

const GoalSetting: React.FC<GoalSettingComponentProps> = ({ goalMutation }) => {
  const [goalReadNewsCount, setGoalReadNewsCount] = useState("");
  const [goalCompleteWord, setGoalCompleteWord] = useState("");
  const [goalPronounceTestScore, setGoalPronounceTestScore] = useState("");

  const handleSave = () => {
    const goalData: GoalSettingType = {
      goalReadNewsCount: parseInt(goalReadNewsCount, 10),
      goalCompleteWord: parseInt(goalCompleteWord, 10),
      goalPronounceTestScore: parseInt(goalPronounceTestScore, 10),
    };

    goalMutation.mutate(goalData);
  };
  return (
    <>
      <GoalContainer>
        <GoalItem>
          <GoalTitle>
            <GoalTitleStrong>뉴스</GoalTitleStrong> 읽기
          </GoalTitle>
          <div>
            <GoalInput
              type="text"
              value={goalReadNewsCount}
              onChange={(e) => setGoalReadNewsCount(e.target.value)}
            />
            개
          </div>
        </GoalItem>
        <GoalItem>
          <GoalTitle>
            <GoalTitleStrong>단어</GoalTitleStrong> 테스트
          </GoalTitle>
          <div>
            <GoalInput
              type="text"
              value={goalCompleteWord}
              onChange={(e) => setGoalCompleteWord(e.target.value)}
            />
            개
          </div>
        </GoalItem>
        <GoalItem>
          <GoalTitle>
            <GoalTitleStrong>발음</GoalTitleStrong> 연습하기
          </GoalTitle>
          <div>
            <GoalInput
              type="text"
              value={goalPronounceTestScore}
              onChange={(e) => setGoalPronounceTestScore(e.target.value)}
            />
            점
          </div>
        </GoalItem>
      </GoalContainer>
      <ButtonContainer>
        <GoalSaveButton onClick={handleSave}>저장하기</GoalSaveButton>
      </ButtonContainer>
    </>
  );
};

export default GoalSetting;

const GoalContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
const GoalItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 6rem;
  margin: 1rem 8rem;
`;

const GoalTitle = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
`;

const GoalTitleStrong = styled.span`
  color: ${(props) => props.theme.colors.primary};
`;
const GoalInput = styled.input`
  text-align: right;
  width: 60px;
  padding: 5px 0;
  margin: 0 0.25rem;
  background-color: ${(props) => props.theme.colors.cardBackground};
  outline: none;
  border: none;
  border-bottom: 2px solid ${(props) => props.theme.colors.text01};
  font-size: 1.5rem;
  transition: border-bottom-color 0.3s ease;

  &:focus {
    border-bottom-color: ${(props) => props.theme.colors.primary};
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const GoalSaveButton = styled.button`
  width: 100px;
  padding: 0.5rem 1rem;
  margin-top: 2rem;
  background: none;
  color: white;
  background-color: ${(props) => props.theme.colors.primary};
  border: none;
  border-radius: 1rem;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.theme.colors.primaryPress};
  }
`;
