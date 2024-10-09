import React from "react";
import styled from "styled-components";

const DifficultyToggleBtn: React.FC<{
  difficulty: number;
  setDifficulty: React.Dispatch<React.SetStateAction<number>>;
  isRead: boolean | undefined;
  setIsReadFinished: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ difficulty, setDifficulty, isRead, setIsReadFinished }) => {
  return (
    <Container id="step2">
      <LowDiv
        $difficulty={difficulty}
        onClick={() => {
          setDifficulty(1);
          if (isRead) {
            setIsReadFinished(isRead);
          }
        }}
      >
        초급
      </LowDiv>
      <MidDiv
        $difficulty={difficulty}
        onClick={() => {
          window.scrollTo(0, 0);
          setDifficulty(2);
          if (isRead) {
            setIsReadFinished(isRead);
          }
        }}
      >
        중급
      </MidDiv>
      <HighDiv
        $difficulty={difficulty}
        onClick={() => {
          window.scrollTo(0, 0);
          setDifficulty(3);
          if (isRead) {
            setIsReadFinished(isRead);
          }
        }}
      >
        고급
      </HighDiv>
      <SelectedDiv $difficulty={difficulty} />
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  width: 10.5rem;
  height: 2rem;
  background-color: ${(props) => props.theme.colors.readonly};
  border-radius: 0.75rem;
  cursor: pointer;
  @media (max-width: 767px) {
    width: 8.25rem;
  }
`;

const ToggleItem = styled.div<{ $difficulty: number }>`
  position: absolute;
  z-index: 2;
  width: 3.5rem;
  height: 2rem;
  line-height: 2rem;
  text-align: center;
  transition: color 0.3s;
  @media (max-width: 767px) {
    width: 2.75rem;
    height: 1.75rem;
    line-height: 1.75rem;
    font-size: 0.875rem;
  }
`;

const LowDiv = styled(ToggleItem)`
  color: ${(props) => props.$difficulty === 1 && "white"};
  left: 0;
`;

const MidDiv = styled(ToggleItem)`
  color: ${(props) => props.$difficulty === 2 && "white"};
  left: 3.5rem;
  @media (max-width: 767px) {
    left: 2.75rem;
  }
`;

const HighDiv = styled(ToggleItem)`
  color: ${(props) => props.$difficulty === 3 && "white"};
  left: 7rem;
  @media (max-width: 767px) {
    left: 5.5rem;
  }
`;

const SelectedDiv = styled.div<{ $difficulty: number }>`
  position: absolute;
  z-index: 1;
  transform: translateX(${(props) => props.$difficulty * 3.5 - 3.5}rem);
  width: 3.5rem;
  height: 2rem;
  transition: transform 0.5s;
  background-color: ${(props) => props.theme.colors.primary};
  border-radius: 0.75rem;
  @media (max-width: 767px) {
    width: 2.75rem;
    transform: translateX(${(props) => props.$difficulty * 2.75 - 2.75}rem);
  }
`;

export default DifficultyToggleBtn;
