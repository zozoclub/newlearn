import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Modal from "@components/Modal";

type Props = {
  posibleWords: number;
};

const StartWordTestWidget: React.FC<Props> = ({ posibleWords }) => {
  const [isWarningModal, setIsWarningModal] = useState<boolean>(false);
  const warningModal = () => setIsWarningModal(true);
  const closewarningModal = () => setIsWarningModal(false);
  const navigate = useNavigate();
  const [wordTestCount, setwordTestCount] = useState(1);

  const handleDecrease = () => {
    if (wordTestCount > 1) setwordTestCount(wordTestCount - 1);
  };

  const handleIncrease = () => {
    if (posibleWords > wordTestCount) {
      setwordTestCount(wordTestCount + 1);
    } else {
      warningModal();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value >= 1) {
      setwordTestCount(value);
    }
  };

  const handleStartTest = () => {
    navigate(`/wordtest?totalCount=${wordTestCount}`);
  };

  const handleGoNewsPage = () => {
    navigate(`/news/0/1`);
  };

  return (
    <WidgetContainer>
      <Title>문장 속 빈칸 단어 맞히기</Title>
      <Explain>
        기사 예문 속 빈칸에 알맞은 단어를 넣어 문장을 완성해보세요.
      </Explain>
      <Explain>
        현재 테스트 가능한 단어 갯수는
        <ExplainNumber>{posibleWords}</ExplainNumber>개 입니다.
      </Explain>
      {!posibleWords ? (
        <DisableButton onClick={handleGoNewsPage}>뉴스 보러가기</DisableButton>
      ) : (
        <>
          <CounterContainer>
            <TextButton onClick={handleDecrease}>-</TextButton>
            <Input
              type="number"
              value={wordTestCount}
              onChange={handleChange}
              min="1"
            />
            <TextButton onClick={handleIncrease}>+</TextButton>
          </CounterContainer>
          <StartButton onClick={handleStartTest}>테스트 하러가기</StartButton>
        </>
      )}

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

export default StartWordTestWidget;

const WidgetContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 2.5rem;
`;

const Explain = styled.p`
  font-size: 1.125rem;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const ExplainNumber = styled.span`
  font-size: 2rem;
  text-align: center;
  font-family: "Righteous", sans-serif;
  margin: 0 1rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.primary};
`;

const CounterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TextButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.colors.primary};
  font-size: 2rem;
  cursor: pointer;
  padding: 0 1rem;
  transition: color 0.3s;
  font-family: "Righteous", sans-serif;

  &:hover {
    color: ${(props) => props.theme.colors.primaryPress};
  }
`;

const Input = styled.input`
  width: 3rem;
  text-align: center;
  background-color: transparent;
  color: ${(props) => props.theme.colors.text};
  font-size: 1.25rem;
  border: none;
  font-family: "Righteous", sans-serif;
  -appearance: textfield;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
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

const DisableButton = styled.button`
  background-color: ${(props) => props.theme.colors.cancel};
  padding: 0.5rem 1rem;
  font-size: 1.25rem;
  font-weight: 700;
  margin-top: 1rem;
  border-radius: 2rem;
  border: none;
  color: ${(props) => props.theme.colors.primaryPress};
  &:hover {
    background-color: ${(props) => props.theme.colors.cancelPress};
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
