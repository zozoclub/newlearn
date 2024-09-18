import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const StartWordTestWidget: React.FC = () => {
  const navigate = useNavigate();
  const [count, setCount] = useState(1);

  const handleDecrease = () => {
    if (count > 1) setCount(count - 1);
  };

  const handleIncrease = () => {
    setCount(count + 1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value >= 1) {
      setCount(value);
    }
  };

  const handleStartTest = () => {
    navigate("/wordtest");
  };

  return (
    <WidgetContainer>
      <Title>문장 속 빈칸 단어 맞추기</Title>
      <Explain>예문 속 빈칸에 알맞은 단어를 넣어 문장을 완성해보세요.</Explain>

      <CounterContainer>
        <TextButton onClick={handleDecrease}>-</TextButton>
        <Input type="number" value={count} onChange={handleChange} min="1" />
        <TextButton onClick={handleIncrease}>+</TextButton>
      </CounterContainer>

      <StartButton onClick={handleStartTest}>테스트 하러가기</StartButton>
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
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
`;

const Explain = styled.p`
  font-size: 1rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const CounterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
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
  font-size: 1rem;
  margin-top: 1rem;
  border-radius: 2rem;
  border: none;
  color: white;
  &:hover {
    background-color: ${(props) => props.theme.colors.primaryPress};
  }
`;
