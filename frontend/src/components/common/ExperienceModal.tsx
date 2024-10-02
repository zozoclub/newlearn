import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import styled, { keyframes, css } from "styled-components";
import { useSetRecoilState } from "recoil";
import { isExpModalState } from "@store/expState";

type ModalProps = {
  isOpen: boolean;
  experience?: number;
  action?: string;
};

const ExperienceModal: React.FC<ModalProps> = ({
  isOpen,
  experience,
  action,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const setExpModal = useSetRecoilState(isExpModalState);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      const openTimer = setTimeout(() => {
        setIsAnimating(false);
        const closeTimer = setTimeout(() => {
          setExpModal({
            isOpen: false,
            experience: 0,
            action: "",
          });
        }, 500);

        return () => clearTimeout(closeTimer);
      }, 2000);

      return () => clearTimeout(openTimer);
    }
  }, [isOpen, setExpModal]);

  if (!isOpen && !isAnimating) return null;

  return ReactDOM.createPortal(
    <ModalOverlay $isOpen={isAnimating}>
      <ModalContent $isOpen={isAnimating}>
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
  padding: 2rem 3rem;
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
