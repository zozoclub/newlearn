import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const StartSpeakingTestWidget: React.FC = () => {
  const navigate = useNavigate();

  const handleStartTest = () => {
    navigate("/speak");
  };
  return (
    <WidgetContainer>
      <Title>발음 정확도 테스트</Title>
      <Explain>제시되는 예문을 읽고 점수를 확인 해보세요.</Explain>
      <StartButton onClick={handleStartTest}>테스트 하러가기</StartButton>
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
  font-size: 1rem;
  margin-top: 1rem;
  border-radius: 2rem;
  border: none;
  color: white;
  &:hover {
    background-color: ${(props) => props.theme.colors.primaryPress};
  }
`;
