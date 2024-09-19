import React from "react";
import styled from "styled-components";

type Props = {
  word: string;
  userAnswer: string;
  onClick: () => void;
  index: number;
};

const WordTestResultWordList: React.FC<Props> = ({
  word,
  userAnswer,
  onClick,
  index,
}) => {
  return (
    <>
      {word === userAnswer ? (
        <ListLayout>
          <Index>{index + 1}.</Index>
          <WordCorrectCard onClick={onClick}>{word}</WordCorrectCard>
        </ListLayout>
      ) : (
        <ListLayout>
          <Index>{index + 1}.</Index>
          <WordWrongCard onClick={onClick}>{word}</WordWrongCard>
        </ListLayout>
      )}
    </>
  );
};

export default WordTestResultWordList;

const WordCorrectCard = styled.div`
  text-align: center;
  width: 100%;
  border: 0.125rem solid ${(props) => props.theme.colors.primary};
  border-radius: 0.5rem;
  margin: 1rem;
  padding: 1rem 6rem;
  cursor: pointer;
  font-size: 1.125rem;
  font-weight: 800;
  color: ${(props) => props.theme.colors.primary};
`;

const WordWrongCard = styled.div`
  text-align: center;
  width: 100%;
  border: 0.125rem solid ${(props) => props.theme.colors.danger};
  border-radius: 0.5rem;
  margin: 1rem;
  padding: 1rem 6rem;
  cursor: pointer;
  font-size: 1.125rem;
  font-weight: 800;
  color: ${(props) => props.theme.colors.danger};
`;

const ListLayout = styled.div`
  display: flex;
  width: 140%;
  justify-content: center;
  align-items: center;
`;

const Index = styled.div`
  font-size: 1.25rem;
  font-weight: 800;
`;
