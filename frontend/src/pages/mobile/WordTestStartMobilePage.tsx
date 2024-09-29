import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const WordTestStartMobilePage: React.FC = () => {
  const navigate = useNavigate();
  const [wordTestCount, setwordTestCount] = useState(1);

  const handleDecrease = () => {
    if (wordTestCount > 1) setwordTestCount(wordTestCount - 1);
  };

  const handleIncrease = () => {
    setwordTestCount(wordTestCount + 1);
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

  return (
    <WidgetContainer>
      <Title>문장 속 빈칸 단어 맞히기</Title>
      <Explain>예문 속 빈칸에 알맞은 단어를 넣어 문장을 완성해보세요.</Explain>

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
    </WidgetContainer>
  );
};

export default WordTestStartMobilePage;

const WidgetContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1rem;
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Explain = styled.p`
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
  text-align: center;
`;

const CounterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const TextButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.colors.primary};
  font-size: 1.75rem;
  cursor: pointer;
  padding: 0 0.75rem;
  transition: color 0.3s;
  font-family: "Righteous", sans-serif;

  &:hover {
    color: ${(props) => props.theme.colors.primaryPress};
  }
`;

const Input = styled.input`
  width: 2.5rem;
  text-align: center;
  background-color: transparent;
  color: ${(props) => props.theme.colors.text};
  font-size: 1rem;
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
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  margin-top: 1rem;
  border-radius: 2rem;
  border: none;
  color: white;
  width: 100%;
  max-width: 200px;
  text-align: center;

  &:hover {
    background-color: ${(props) => props.theme.colors.primaryPress};
  }
`;
