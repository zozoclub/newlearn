import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import wordTestIcon from "@assets/icons/mobile/wordTestIcon.png";

const WordTestIntroMobilePage: React.FC = () => {
  const navigate = useNavigate();
  const [wordTestCount, setWordTestCount] = useState(1);

  const handleDecrease = () => {
    if (wordTestCount > 1) setWordTestCount(wordTestCount - 1);
  };

  const handleIncrease = () => {
    setWordTestCount(wordTestCount + 1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value >= 1) {
      setWordTestCount(value);
    } else {
      setWordTestCount(1);
    }
  };

  const handleStartWordTest = () => {
    navigate(`/wordtest?totalCount=${wordTestCount}`);
  };

  const handleViewResults = () => {
    navigate("/wordtest/result/list");
  };

  return (
    <MainContainer>
      <ImageContainer>
        <WordTestIcon src={wordTestIcon} alt="Word Test" />
      </ImageContainer>

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

      <StartButton onClick={handleStartWordTest}>테스트 하러가기</StartButton>

      <ResultsButton onClick={handleViewResults}>
        단어 테스트 히스토리
      </ResultsButton>
    </MainContainer>
  );
};

export default WordTestIntroMobilePage;

// Styled Components
const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  padding: 2rem;
  background-color: ${(props) => props.theme.colors.cardBackground};
`;

const ImageContainer = styled.div`
  margin-bottom: 2rem;
  width: 50%;
  display: flex;
  justify-content: center;
`;

const WordTestIcon = styled.img`
  width: 100%;  // 너비를 %로 설정하여 부모 요소에 맞게 반응
  max-width: 150px;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-align: center;
  width: 90%; // 너비를 %로 설정하여 작은 화면에서도 자동 조정
`;

const Explain = styled.p`
  font-size: 1rem;
  margin-bottom: 1rem;
  text-align: center;
  width: 90%;
`;

const CounterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 90%; // 너비를 %로 설정하여 반응형으로
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

  width: 20%; // 버튼 너비를 %로 설정하여 반응형
`;

const Input = styled.input`
  width: 20%;
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
  width: 80%;
  padding: 1rem;
  font-size: 1.25rem;
  color: white;
  background-color: ${(props) => props.theme.colors.primary};
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 1rem;

  &:hover {
    background-color: ${(props) => props.theme.colors.primaryPress};
  }
`;

const ResultsButton = styled(StartButton)`
  background-color: ${(props) => props.theme.colors.primary};
  margin-top: 0.5rem;

  &:hover {
    background-color: ${(props) => props.theme.colors.primaryPress};
  }
`;
