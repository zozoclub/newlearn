import React, { useState } from "react";
import styled from "styled-components";
import { UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { GoalSettingType } from "@services/goalService";
import { useSetRecoilState } from "recoil";
import goalState from "@store/goalState";
import QuestionMark from "@assets/icons/QuestionMark";

type GoalSettingComponentProps = {
  goalMutation: UseMutationResult<GoalSettingType, Error, GoalSettingType>;
};

const GoalSetting: React.FC<GoalSettingComponentProps> = ({ goalMutation }) => {
  const [goalReadNewsCount, setGoalReadNewsCount] = useState("");
  const [goalCompleteWord, setGoalCompleteWord] = useState("");
  const [goalPronounceTestScore, setGoalPronounceTestScore] = useState("");
  const [showPronounceTooltip, setShowPronounceTooltip] = useState(false);
  const [showWordTestTooltip, setShowWordTestTooptip] = useState(false);
  const [errorMessages, setErrorMessages] = useState({
    goalReadNewsCount: "",
    goalCompleteWord: "",
    goalPronounceTestScore: "",
  });

  const queryClient = useQueryClient();
  const setGoalState = useSetRecoilState(goalState);

  const handleInputChange =
    (
      field: keyof typeof errorMessages,
      setter: React.Dispatch<React.SetStateAction<string>>,
      minValue: number
    ) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (
        value === "" ||
        (parseInt(value) >= minValue && !value.includes("."))
      ) {
        setter(value);
        setErrorMessages((prev) => ({ ...prev, [field]: "" }));
      } else {
        setter(value);
        setErrorMessages((prev) => ({
          ...prev,
          [field]: `${minValue} 이상의 값을 입력해주세요.`,
        }));
      }
    };

  const handleSave = async () => {
    const newErrorMessages = {
      goalReadNewsCount:
        parseInt(goalReadNewsCount) < 20 ? "20 이상의 값을 입력해주세요." : "",
      goalCompleteWord:
        parseInt(goalCompleteWord) < 20 ? "20 이상의 값을 입력해주세요." : "",
      goalPronounceTestScore:
        parseInt(goalPronounceTestScore) < 200
          ? "200 이상의 값을 입력해주세요."
          : "",
    };

    setErrorMessages(newErrorMessages);

    if (Object.values(newErrorMessages).some((msg) => msg !== "")) {
      return;
    }

    const goalData: GoalSettingType = {
      goalReadNewsCount: parseInt(goalReadNewsCount, 10) || 20,
      goalCompleteWord: parseInt(goalCompleteWord, 10) || 20,
      goalPronounceTestScore: parseInt(goalPronounceTestScore, 10) || 200,
    };

    await goalMutation.mutateAsync(goalData);

    // 쿼리 무효화
    await queryClient.invalidateQueries({ queryKey: ["getStudyProgress"] });
    const newData = await queryClient.fetchQuery({
      queryKey: ["getStudyProgress"],
    });

    if (newData && typeof newData === "object" && !Array.isArray(newData)) {
      // Recoil 상태 업데이트
      setGoalState((prevState) => ({
        ...prevState,
        ...newData,
        isInitialized: true,
      }));

      console.log("goalState 업데이트 완료");
    } else {
      console.error("newData가 객체가 아닙니다:", newData);
    }
  };

  return (
    <>
      <GoalContainer>
        <div>
          {new Date().getMonth() + 1}월 목표는 설정 후{" "}
          <u>수정할 수 없습니다.</u>
        </div>
        <div>
          이번 달 목표를 달성하면 <u>추가 경험치</u>를 획득할 수 있어요.
        </div>
        <GoalItem>
          <GoalTitle>
            <GoalTitleStrong>뉴스</GoalTitleStrong> 읽기
          </GoalTitle>
          <GoalInputContainer>
            <div>
              <GoalInput
                type="number"
                min="1"
                value={goalReadNewsCount}
                onChange={handleInputChange(
                  "goalReadNewsCount",
                  setGoalReadNewsCount,
                  20
                )}
              />
              개
            </div>
            <div>
              <ErrorMessage>{errorMessages.goalReadNewsCount}</ErrorMessage>
            </div>
          </GoalInputContainer>
        </GoalItem>
        <GoalItem>
          <GoalTitle>
            <GoalTitleStrong>단어</GoalTitleStrong> 테스트
            <TooltipContainer>
              <QuestionMark
                onMouseEnter={() => setShowWordTestTooptip(true)}
                onMouseLeave={() => setShowWordTestTooptip(false)}
              />
              {showWordTestTooltip && (
                <Tooltip>
                  단어 테스트는 맞춘 단어의 개수를 목표로 설정합니다.
                </Tooltip>
              )}
            </TooltipContainer>
          </GoalTitle>
          <GoalInputContainer>
            <div>
              <GoalInput
                type="number"
                min="1"
                value={goalCompleteWord}
                onChange={handleInputChange(
                  "goalCompleteWord",
                  setGoalCompleteWord,
                  20
                )}
              />
              개
            </div>
            <div>
              <ErrorMessage>{errorMessages.goalCompleteWord}</ErrorMessage>
            </div>
          </GoalInputContainer>
        </GoalItem>
        <GoalItem>
          <GoalTitle>
            <GoalTitleStrong>발음</GoalTitleStrong> 연습하기
            <TooltipContainer>
              <QuestionMark
                onMouseEnter={() => setShowPronounceTooltip(true)}
                onMouseLeave={() => setShowPronounceTooltip(false)}
              />
              {showPronounceTooltip && (
                <Tooltip>
                  발음 연습하기는 1회 테스트 시 100점 만점으로, 점수 합계를
                  목표로 설정합니다.
                </Tooltip>
              )}
            </TooltipContainer>
          </GoalTitle>
          <GoalInputContainer>
            <div>
              <GoalInput
                type="number"
                min="200"
                value={goalPronounceTestScore}
                onChange={handleInputChange(
                  "goalPronounceTestScore",
                  setGoalPronounceTestScore,
                  200
                )}
              />
              점
            </div>
            <div>
              <ErrorMessage>
                {errorMessages.goalPronounceTestScore}
              </ErrorMessage>
            </div>
          </GoalInputContainer>
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
  text-align: center;
  gap: 0.5rem;
`;
const GoalItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 6rem;
  margin: 0.5rem 8rem;
`;

const GoalTitle = styled.div`
  display: flex;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: bold;
`;

const GoalTitleStrong = styled.span`
  color: ${(props) => props.theme.colors.primary};
`;
const GoalInput = styled.input`
  text-align: right;
  width: 110px;
  padding: 5px 0;
  margin: 0 0.25rem;

  color: ${(props) => props.theme.colors.text};
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

const TooltipContainer = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  margin-left: 0.5rem;
`;

const Tooltip = styled.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #333;
  color: white;
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  width: 200px;
  text-align: center;
  z-index: 1000;
  margin-bottom: 0.5rem;

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #333 transparent transparent transparent;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 0.75rem;
  height: 1rem;
  margin-top: 0.25rem;
  text-align: right;
  width: 100%;
`;

const GoalInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: end;
`;
