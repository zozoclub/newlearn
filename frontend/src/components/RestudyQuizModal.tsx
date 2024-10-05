import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import styled, { keyframes, css } from "styled-components";
import Modal from "@components/Modal"; // 확인용 모달을 사용

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
};

const RestudyQuizModal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false); // 종료 확인 모달 상태 추가

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    } else {
      const timer = setTimeout(() => setIsAnimating(false), 200); // 애니메이션 지속 시간과 일치
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setIsConfirmModalOpen(true); // 바깥 클릭 시 종료 확인 모달 열기
    }
  };

  const handleConfirmClose = () => {
    setIsConfirmModalOpen(false); // 종료 확인 모달 닫기
    onClose(); // 모달 닫기
  };

  const handleCancelClose = () => {
    setIsConfirmModalOpen(false); // 종료 취소
  };

  if (!isOpen && !isAnimating) return null;

  return ReactDOM.createPortal(
    <>
      <ModalOverlay $isOpen={isOpen} onClick={handleOverlayClick}>
        <ModalContent $isOpen={isOpen}>
          <ModalHeader>
            {title && <ModalTitle>{title}</ModalTitle>}
          </ModalHeader>
          <ModalBody>{children}</ModalBody>
        </ModalContent>
      </ModalOverlay>

      {/* 종료 확인 모달 */}
      <Modal isOpen={isConfirmModalOpen} onClose={handleCancelClose} title="확인">
        <p>정말 종료하시겠습니까?</p>
        <ModalButtonContainer>
          <ModalCancelButton onClick={handleCancelClose}>취소</ModalCancelButton>
          <ModalConfirmButton onClick={handleConfirmClose}>확인</ModalConfirmButton>
        </ModalButtonContainer>
      </Modal>
    </>,
    document.body
  );
};

export default RestudyQuizModal;

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
  position: relative;
  min-width: 60%;
  max-width: 90%;
  padding: 2rem;
  background-color: ${(props) => props.theme.colors.cardBackground};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  animation: ${({ $isOpen }) =>
    $isOpen
      ? css`
          ${fadeIn} 0.2s ease-out forwards
        `
      : css`
          ${fadeOut} 0.2s ease-in forwards
        `};
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1rem;
`;

const ModalTitle = styled.div`
  font-size: 1.25rem;
  font-weight: bold;
`;

const ModalBody = styled.div`
  padding-top: 1rem;
`;

const ModalButtonContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 2rem;
`;

const ModalCancelButton = styled.button`
  padding: 0.5rem 1.5rem;
  background-color: ${(props) => props.theme.colors.placeholder};
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => props.theme.colors.danger};
  }
`;

const ModalConfirmButton = styled.button`
  padding: 0.5rem 1.5rem;
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => props.theme.colors.primaryPress};
  }
`;
