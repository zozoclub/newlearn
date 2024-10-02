import styled from "styled-components";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import locationState from "@store/locationState";
import goalState from "@store/goalState";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useMutation } from "@tanstack/react-query";

import GoalChart from "@components/GoalChart";
import GoalSetting from "@components/GoalSetting";
import testMenuBg from "@assets/images/background-testmenu.png";
import vocaMenuBg from "@assets/images/background-vocamenu.png";
import Modal from "@components/Modal";
import Spinner from "@components/Spinner";

import {
  GoalSettingType,
  goalSetting,
  getStudyProgress,
} from "@services/goalService.ts";

const MyStudyPage = () => {
  const navigate = useNavigate();
  const [studyProgress, setStudyProgress] = useRecoilState(goalState);

  // 페이지 헤더
  const setCurrentLocation = useSetRecoilState(locationState);
  useEffect(() => {
    setCurrentLocation("My Study");
  }, [setCurrentLocation]);

  // 페이지 이동
  const handleVocaClick = () => {
    navigate("/voca");
  };

  const handleTestClick = () => {
    navigate("/testhistory");
  };

  // 모달 설정
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // 학습 목표 설정
  const goalMutation = useMutation<GoalSettingType, Error, GoalSettingType>({
    mutationFn: (data: GoalSettingType) => goalSetting(data),
    onSuccess: (result) => {
      setStudyProgress((goalInfo) => ({
        ...goalInfo,
        ...result,
        isInitialized: true,
      }));

      getStudyProgress()
        .then((updatedStudyProgress) => {
          setStudyProgress((goalInfo) => ({
            ...goalInfo,
            ...updatedStudyProgress,
          }));
        })
        .catch((error) => {
          console.error("Failed to fetch updated study progress", error);
        });

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
    <Container>
      <GoalContainer>
        {studyProgress.goalReadNewsCount === 0 &&
        studyProgress.goalPronounceTestScore === 0 &&
        studyProgress.goalCompleteWord === 0 ? (
          <GoalSettingContainer>
            <GoalSettingDescription>
              설정된 목표가 없습니다.
            </GoalSettingDescription>
            <GoalSettingButton onClick={openModal}>
              목표 설정하기
            </GoalSettingButton>
            <Modal isOpen={isModalOpen} onClose={closeModal} title="목표 설정">
              <GoalSetting goalMutation={goalMutation} />
            </Modal>
          </GoalSettingContainer>
        ) : (
          <GoalChart />
        )}
      </GoalContainer>
      <MenuContainer>
        <VocaMenu onClick={handleVocaClick}>
          <Overlay>
            <MenuTitle>Vocabulary</MenuTitle>
            <MenuDescription>내가 저장한 단어</MenuDescription>
          </Overlay>
        </VocaMenu>
        <WordMenu onClick={handleTestClick}>
          <Overlay>
            <MenuTitle>Test</MenuTitle>
            <MenuDescription>내가 저장한 단어 테스트</MenuDescription>
            <MenuDescription>발음 테스트 및 분석</MenuDescription>
          </Overlay>
        </WordMenu>
      </MenuContainer>
    </Container>
  );
};

export default MyStudyPage;

const Container = styled.div`
  display: flex;
  gap: 3rem;
  min-height: 560px;
`;

const GoalContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;

  height: 100%;
  min-height: 560px;

  background-color: ${(props) => props.theme.colors.cardBackground + "BF"};
  box-shadow: 0.25rem 0.25rem 0.25rem ${(props) => props.theme.colors.shadow};
  box-sizing: border-box;
  border-radius: 0.75rem;
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
`;

const MenuContainer = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 2.75rem;
`;

const MenuItemBase = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  position: relative;

  width: 100%;
  height: 100%;
  padding: 1.75rem;

  color: white;
  backdrop-filter: blur(4px);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  box-shadow: 0.25rem 0.25rem 0.25rem ${(props) => props.theme.colors.shadow};
  box-sizing: border-box;

  border-radius: 12px;

  font-size: 1.5rem;
  font-weight: bold;

  transition: all 0.5s ease;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  cursor: pointer;

  &:hover {
    transform: scale(1.01);
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: inherit;
    filter: grayscale(100%);
    transition: all 0.5s ease;
  }

  &:hover::before {
    filter: grayscale(0%);
    transform: scale();
  }
`;

const Overlay = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;

  width: 100%;
  height: 100%;
  padding: 0 3rem;
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.7) 0%,
    rgba(0, 0, 0, 0.3) 50%,
    rgba(0, 0, 0, 0) 100%
  );
  box-sizing: border-box;
`;

const MenuTitle = styled.h2`
  margin: 0.5rem 0;
  font-size: 2.5rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`;

const MenuDescription = styled.div`
  margin: 0.5rem 0;
  font-size: 1.25rem;
`;
const VocaMenu = styled(MenuItemBase)`
  background-image: url(${vocaMenuBg});
`;

const WordMenu = styled(MenuItemBase)`
  background-image: url(${testMenuBg});
`;
