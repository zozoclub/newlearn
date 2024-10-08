// src/components/Goal.tsx

import { useState } from "react";
import { useRecoilState } from "recoil";
import { useMutation } from "@tanstack/react-query";
import styled from "styled-components";

import goalState from "@store/goalState";
import GoalChart from "@components/mystudypage/GoalChart";
import GoalSetting from "@components/mystudypage/GoalSetting";
import Modal from "@components/Modal";
import Spinner from "@components/Spinner";

import {
  GoalSettingType,
  goalSetting,
  getStudyProgress,
} from "@services/goalService.ts";

const Goal = () => {
  const [studyProgress, setStudyProgress] = useRecoilState(goalState);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const goalMutation = useMutation<GoalSettingType, Error, GoalSettingType>({
    mutationFn: (data: GoalSettingType) => goalSetting(data),
    onSuccess: async (result) => {
      setStudyProgress((goalInfo) => ({
        ...goalInfo,
        ...result,
        isInitialized: true,
      }));

      try {
        const updatedStudyProgress = await getStudyProgress();
        setStudyProgress((goalInfo) => ({
          ...goalInfo,
          ...updatedStudyProgress,
        }));
      } catch (error) {
        console.error("Failed to fetch updated study progress", error);
      }

      closeModal();
    },
    onError: (error) => {
      console.error("Goal setting Failed", error);
    },
  });

  const isSetGoal =
    studyProgress.goalCompleteWord &&
    studyProgress.goalPronounceTestScore &&
    studyProgress.goalReadNewsCount
      ? true
      : false;

  if (isSetGoal && !studyProgress.isInitialized) return <Spinner />;

  return (
    <GoalContainer>
      {!isSetGoal ? (
        <GoalSettingContainer>
          <GoalSettingDescription>
            설정된 목표가 없습니다.
          </GoalSettingDescription>
          <GoalSettingButton onClick={openModal}>
            {new Date().getMonth() + 1}월 목표 설정하기
          </GoalSettingButton>
          <Modal isOpen={isModalOpen} onClose={closeModal} title="목표 설정">
            <GoalSetting goalMutation={goalMutation} />
          </Modal>
        </GoalSettingContainer>
      ) : (
        <GoalChart />
      )}
    </GoalContainer>
  );
};

export default Goal;

const GoalContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  min-height: 600px;
  padding: 0 2rem;
  background-color: ${(props) => props.theme.colors.cardBackground01};
  box-shadow: ${(props) => props.theme.shadows.small};
  box-sizing: border-box;
  border-radius: 0.75rem;
  @media (max-width: 768px) {
    align-items: start;
    margin-top: 70px;
    height: calc(100% - 70px);
    box-shadow: none;
  }
`;

const GoalSettingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
`;

const GoalSettingDescription = styled.div`
  font-size: 1.25rem;
  font-weight: bold;
`;

const GoalSettingButton = styled.button`
  min-width: 150px;
  margin: 0 7rem;
  padding: 0.75rem 1.25rem;
  background: none;
  background-color: ${(props) => props.theme.colors.primary};
  border: none;
  border-radius: 1rem;
  font-size: 1.25rem;
  font-weight: bold;
  color: white;
  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.theme.colors.primaryPress};
  }

  @media (max-width: 767px) {
    font-size: 1rem;
    padding: 0.75rem 1rem;
  }
`;
