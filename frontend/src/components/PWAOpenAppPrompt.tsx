import { useState } from "react";
import { usePWAPrompt } from "@utils/usePWAPrompt";
import Modal from "@components/Modal";
import styled from "styled-components";

export const PWAOpenAppPrompt = () => {
  const [isInstalled, isPWA, isMobile, , handleOpenAppClick] = usePWAPrompt({});
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const handleClose = () => setIsOpen(false);
  return (
    isInstalled &&
    !isPWA &&
    isMobile &&
    isOpen && (
      <Modal isOpen={isOpen} onClose={handleClose} title="앱 설cl">
        <p>앱으로 사용하면 더 편하게 사용할 수 있습니다!</p>
        <ModalButtonContainer>
          <ModalCancelButton onClick={handleClose}>취소</ModalCancelButton>
          <ModalConfirmButton onClick={handleOpenAppClick}>
            확인
          </ModalConfirmButton>
        </ModalButtonContainer>
      </Modal>
    )
  );
};

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
