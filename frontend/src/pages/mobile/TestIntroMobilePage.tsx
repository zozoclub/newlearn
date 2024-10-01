import React, { useState } from "react";
import styled from "styled-components";
import WordTestIntroModalMobilePage from "./WordTestIntroModalMobilePage";
import SpeakingTestIntroModalMobilePage from "./SpeakingTestIntroModalMobilePage";

const TestIntroMobilePage: React.FC = () => {
    const [isWordTestModalOpen, setIsWordTestModalOpen] = useState(false);
    const [isSpeakingTestModalOpen, setIsSpeakingTestModalOpen] = useState(false);

    const handleOpenWordTestModal = () => {
        setIsWordTestModalOpen(true);
    };

    const handleOpenSpeakingTestModal = () => {
        setIsSpeakingTestModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsWordTestModalOpen(false);
        setIsSpeakingTestModalOpen(false);
    };

    return (
        <MainContainer>
            <Title>Test Intro Mobile Page</Title>
            {/* 두 개의 버튼으로 선택지가 생깁니다 */}
            <OpenModalButton onClick={handleOpenWordTestModal}>
                Open Word Test Modal
            </OpenModalButton>
            <OpenModalButton onClick={handleOpenSpeakingTestModal}>
                Open Speaking Test Modal
            </OpenModalButton>

            {/* Word Test Modal */}
            {isWordTestModalOpen && (
                <ModalWrapper>
                    <WordTestIntroModalMobilePage />
                    <CloseModalButton onClick={handleCloseModal}>Close</CloseModalButton>
                </ModalWrapper>
            )}

            {/* Speaking Test Modal */}
            {isSpeakingTestModalOpen && (
                <ModalWrapper>
                    <SpeakingTestIntroModalMobilePage />
                    <CloseModalButton onClick={handleCloseModal}>Close</CloseModalButton>
                </ModalWrapper>
            )}
        </MainContainer>
    );
};

export default TestIntroMobilePage;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: ${(props) => props.theme.colors.background};
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const OpenModalButton = styled.button`
  padding: 1rem;
  font-size: 1.25rem;
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => props.theme.colors.primaryPress};
  }

  margin-bottom: 1rem;
`;

// Modal
const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000; 
`;

const CloseModalButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: red;
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  z-index: 1100;

  &:hover {
    background-color: darkred;
  }
`;
