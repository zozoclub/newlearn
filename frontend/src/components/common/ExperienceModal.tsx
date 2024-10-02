import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import styled, { keyframes, css } from "styled-components";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  experience: number;
  action: string;
};

const ExperienceModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  experience,
  action,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      // 1초 후에 모달 닫기
      const timer = setTimeout(() => {
        onClose();
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      // 페이드 아웃 애니메이션을 위한 짧은 지연
      const animationTimer = setTimeout(() => setIsAnimating(false), 200);
      return () => clearTimeout(animationTimer);
    }
  }, [isOpen, onClose]);

  if (!isOpen && !isAnimating) return null;

  return ReactDOM.createPortal(
    <ModalOverlay $isOpen={isOpen}>
      <ModalContent $isOpen={isOpen}>
        <ExperienceText>
          Exp <ExperienceNumber>+{experience}</ExperienceNumber>
        </ExperienceText>
        <ActionText>{action} 완료!</ActionText>
      </ModalContent>
    </ModalOverlay>,
    document.body
  );
};

export default ExperienceModal;

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
  bottom: 0;
  left: 0;
  z-index: 10;

  background-color: rgba(0, 0, 0, 0.5);

  animation: ${({ $isOpen }) =>
    $isOpen
      ? css`
          ${fadeIn} 0.2s ease-out forwards
        `
      : css`
          ${fadeOut} 0.2s ease-in forwards
        `};
`;

const ModalContent = styled.div<{ $isOpen: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: auto;
  padding: 2rem 3rem;
  background-color: ${(props) => props.theme.colors.cardBackground};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 1rem;
  animation: ${({ $isOpen }) =>
    $isOpen
      ? css`
          ${fadeIn} 0.2s ease-out forwards
        `
      : css`
          ${fadeOut} 0.2s ease-in forwards
        `};
`;

const ExperienceText = styled.div`
  font-size: 2rem;
  font-family: "Righteous";

  margin-bottom: 0.5rem;
`;

const ExperienceNumber = styled.span`
  color: #4285f4;
`;

const ActionText = styled.div`
  margin-top: 0.5rem;
  font-size: 1rem;
  color: ${(props) => props.theme.colors.text02};
`;
