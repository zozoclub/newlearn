import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Modal from "@components/Modal";
import { useMediaQuery } from "react-responsive";
import speakingTestIcon from "@assets/icons/mobile/speakingTestIcon.png";

type Props = {
  posibleWords: number;
};

const StartSpeakingTestWidget: React.FC<Props> = ({ posibleWords }) => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
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

  if (isMobile) {
    return (
      <MobileWidgetContainer>
        <ImageTag>
          <img src={speakingTestIcon} alt="speakingTestIcon" width={200} />
        </ImageTag>
        <MobileExplain>제시되는 기사 예문을 읽고 내 발음 점수를 확인 해보세요.</MobileExplain>
        <MobileExplain>
          테스트 진행하는 문장 개수는
          <ExplainNumber>3</ExplainNumber>문항 입니다.
        </MobileExplain>
        <StartButton onClick={handleStartTest}>테스트 시작</StartButton>
        <MobileTipContainer>
          <MobileTip>단어장에 저장된 단어의 예문이 출제됩니다.</MobileTip>
          <MobileTip>저장된 단어가 3개 미만일 경우에 문항수가 제한됩니다.</MobileTip>
        </MobileTipContainer>
        <Modal isOpen={isWarningModal} onClose={closewarningModal} title="알림">
          <p>단어장보다 테스트 개수가 많을 수 없습니다.</p>
          <ModalButtonContainer>
            <ModalConfirmButton onClick={closewarningModal}>
              확인
            </ModalConfirmButton>
          </ModalButtonContainer>
        </Modal>
      </MobileWidgetContainer>
    )
  }

  return (
    <WidgetContainer>
      <ImageTag>
        <img src={speakingTestIcon} alt="speakingTestIcon" width={200} />
      </ImageTag>
      <Title>문장 발음 테스트</Title>
      <Explain>제시되는 기사 예문을 읽고 내 발음 점수를 확인 해보세요.</Explain>
      <Explain>
        테스트 진행하는 문장 개수는
        <ExplainNumber>3</ExplainNumber>문항 입니다.
      </Explain>
      <Tip>단어장에 저장된 단어의 예문이 출제됩니다.</Tip>
      <Tip>저장된 단어가 3개 미만일 경우에 문항수가 제한됩니다.</Tip>
      <StartButton onClick={handleStartTest}>테스트 시작</StartButton>
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

const StartButton = styled.button`
  background-color: ${(props) => props.theme.colors.primary};
  padding: 0.5rem 1rem;
  font-size: 1.25rem;
  font-weight: 700;
  margin-top: 1rem;
  border-radius: 2rem;
  border: none;
  color: white;
  cursor: pointer;
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

const Tip = styled.p`
  font-size: 1rem;
  margin-bottom: 1rem;
  text-align: center;
  color: ${(props) => props.theme.colors.placeholder};
`

// 모바일 전용

const MobileWidgetContainer = styled.div`
display: flex;
flex-direction: column;
`;

const ImageTag = styled.div`
display: flex;
justify-content: center;
margin-bottom: 2rem;
`

const MobileTipContainer = styled.div`
  margin: 1.5rem 0;
`
const MobileExplain = styled.p`
  font-size: 0.875rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const MobileTip = styled.p`
  font-size: 0.875rem;
  margin-top : 0.5rem;
  text-align: center;
  color: ${(props) => props.theme.colors.text04};
`