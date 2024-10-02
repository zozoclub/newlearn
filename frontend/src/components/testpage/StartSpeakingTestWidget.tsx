import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Modal from "@components/Modal";

type Props = {
  posibleWords: number;
};

const StartSpeakingTestWidget: React.FC<Props> = ({ posibleWords }) => {
  const navigate = useNavigate();
  const [isWarningModal, setIsWarningModal] = useState<boolean>(false);
  const warningModal = () => setIsWarningModal(true);
  const closewarningModal = () => setIsWarningModal(false);

  const handleStartTest = () => {
    if (posibleWords) {
      navigate("/speakingtest");
    } else {
      warningModal();
    }
  };
  return (
    <WidgetContainer>
      <Title>발음 정확도 테스트</Title>
      <Explain>제시되는 예문을 읽고 점수를 확인 해보세요.</Explain>
      <StartButton onClick={handleStartTest}>테스트 하러가기</StartButton>
      <Modal isOpen={isWarningModal} onClose={closewarningModal} title="알림">
        <p>단어장보다 테스트 개수가 많을 수 없습니다.</p>
        <ModalButtonContainer>
          <ModalConfirmButton onClick={closewarningModal}>
            확인
          </ModalConfirmButton>
        </ModalButtonContainer>
      </Modal>
    </WidgetContainer>
  );
};

export default StartSpeakingTestWidget;

const WidgetContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
`;

const Explain = styled.p`
  font-size: 1rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const StartButton = styled.button`
  background-color: ${(props) => props.theme.colors.primary};
  padding: 0.5rem 1rem;
  font-size: 1.25rem;
  font-weight: 700;
  margin-top: 1rem;
  border-radius: 2rem;
  border: none;
  color: white;
  &:hover {
    background-color: ${(props) => props.theme.colors.primaryPress};
  }
`;

const ModalButtonContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 2rem;
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
