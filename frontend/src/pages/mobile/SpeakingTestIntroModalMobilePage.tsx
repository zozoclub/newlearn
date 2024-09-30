import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import speakingTestIcon from "@assets/icons/mobile/speakingTestIcon.png";

const SpeakingTestIntroModalMobilePage: React.FC = () => {
  const navigate = useNavigate();
  
  const handleStartSpeakingTest = () => {
    navigate("/m/speakingtest/start"); 
  };

  const handleViewResults = () => {
    navigate("/m/speakingtest/result/list"); 
  };

  return (
    <MainContainer>
      <ImageContainer>
        <SpeakingTestIcon src={speakingTestIcon} alt="Speaking Test" />
      </ImageContainer>
      <ButtonContainer>
        <StartButton onClick={handleStartSpeakingTest}>
          발음 테스트 보러가기
        </StartButton>
        <ResultsButton onClick={handleViewResults}>
          발음 테스트 결과 보러가기
        </ResultsButton>
      </ButtonContainer>
    </MainContainer>
  );
};

export default SpeakingTestIntroModalMobilePage;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: ${(props) => props.theme.colors.cardBackground};
  height: 100vh;
`;

const ImageContainer = styled.div`
  margin-bottom: 2rem;
`;

const SpeakingTestIcon = styled.img`
  width: 150px;
  height: 150px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 400px;
`;

const StartButton = styled.button`
  padding: 1rem;
  font-size: 1.25rem;
  color: white;
  background-color: ${(props) => props.theme.colors.primary};
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${(props) => props.theme.colors.primaryPress};
  }
`;

const ResultsButton = styled(StartButton)`
  background-color: ${(props) => props.theme.colors.primary};

  &:hover {
    background-color: ${(props) => props.theme.colors.primaryPress};
  }
`;
