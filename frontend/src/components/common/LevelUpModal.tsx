import React, { useState } from "react";
// useEffect,
import ReactDOM from "react-dom";
import styled, { keyframes, css } from "styled-components";
import { useRecoilValue } from "recoil";
import { calculateExperience } from "@utils/calculateExperience";
import userInfoState from "@store/userInfoState";
import LevelIcon from "@components/common/LevelIcon";

const LevelUpModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const userInfo = useRecoilValue(userInfoState);

  const calculatedExperience = calculateExperience(userInfo.experience);
  const level = calculatedExperience.level;

  //   useEffect(() => {
  //     if (level) {
  //       setIsOpen(true);
  //     }
  //   }, [userInfo.experience]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <ModalOverlay $isOpen={isOpen}>
      <ModalContent $isOpen={isOpen}>
        <ExperienceText>
          Level Up <BlueContainer>+</BlueContainer>
        </ExperienceText>
        <Description>
          <ActionText>축하합니다!</ActionText>
          <ActionText>레벨이 상승했습니다!</ActionText>
          <LevelIcon level={level} size={72} />
          <OkayButton onClick={() => setIsOpen(false)}>확인</OkayButton>
        </Description>
      </ModalContent>
    </ModalOverlay>,
    document.body
  );
};

export default LevelUpModal;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;

  position: fixed;
  top: 0;
  right: 0;
  bottom: 50;
  left: 0;
  z-index: 100;

  animation: ${({ $isOpen }) =>
    $isOpen
      ? css`
          ${fadeIn} 0.5s ease-out forwards
        `
      : css`
          ${fadeOut} 0.5s ease-in forwards
        `};
`;

const ModalContent = styled.div<{ $isOpen: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  margin-top: 3rem;
  width: auto;
  padding: 2rem 6rem;
  background-color: ${(props) => props.theme.colors.cardBackground};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 1rem;
  animation: ${({ $isOpen }) =>
    $isOpen
      ? css`
          ${fadeIn} 0.5s ease-out forwards
        `
      : css`
          ${fadeOut} 0.5s ease-in forwards
        `};
`;

const ExperienceText = styled.div`
  font-size: 3rem;
  font-family: "Righteous";

  margin-bottom: 2rem;
`;

const BlueContainer = styled.span`
  color: #4285f4;
`;

const Description = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  gap: 1rem;
`;

const ActionText = styled.div`
  font-size: 1.25rem;
  color: ${(props) => props.theme.colors.text02};
`;

const OkayButton = styled.button`
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  font-size: 1rem;
  color: white;
  background-color: ${(props) => props.theme.colors.primary};
  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.theme.colors.primaryPress};
  }
`;
