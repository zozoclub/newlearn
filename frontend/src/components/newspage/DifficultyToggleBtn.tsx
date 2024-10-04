import React from "react";
import styled from "styled-components";

const DifficultyToggleBtn: React.FC<{
  difficulty: number;
  setDifficulty: React.Dispatch<React.SetStateAction<number>>;
  isRead: boolean | undefined;
  setIsReadFinished: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ difficulty, setDifficulty, isRead, setIsReadFinished }) => {
  return (
    <Container>
      <HighDiv
        onClick={() => {
          setDifficulty(3);
          if (isRead) {
            setIsReadFinished(isRead);
          }
        }}
      >
        고급
      </HighDiv>
      <MidDiv
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
      <LowDiv
        onClick={() => {
          window.scrollTo(0, 0);
          setDifficulty(1);
          if (isRead) {
            setIsReadFinished(isRead);
          }
        }}
      >
        초급
      </LowDiv>
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
`;

const ToggleItem = styled.div`
  position: absolute;
  z-index: 2;
  width: 3.5rem;
  height: 2rem;
  line-height: 2rem;
  text-align: center;
`;

const HighDiv = styled(ToggleItem)`
  left: 0;
`;

const MidDiv = styled(ToggleItem)`
  left: 3.5rem;
`;

const LowDiv = styled(ToggleItem)`
  left: 7rem;
`;

const SelectedDiv = styled.div<{ $difficulty: number }>`
  position: absolute;
  z-index: 1;
  transform: translateX(${(props) => 10.5 - 3.5 * props.$difficulty}rem);
  width: 3.5rem;
  height: 2rem;
  transition: transform 0.5s;
  background-color: ${(props) => props.theme.colors.primary};
  border-radius: 0.75rem;
`;

export default DifficultyToggleBtn;
