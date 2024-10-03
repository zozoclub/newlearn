import React from "react";
import styled from "styled-components";

type Props = {
  word: string;
  userAnswer: string;
  onClick: () => void;
  index: number;
  isFocusWord: boolean;
};

const WordTestResultWordList: React.FC<Props> = ({
  word,
  userAnswer,
  onClick,
  index,
  isFocusWord,
}) => {
  return (
    <>
      {word === userAnswer ? (
        <ListLayout>
          <Index>{index + 1}.</Index>
          <WordCorrectCard $isFocusWord={isFocusWord} onClick={onClick}>
            {word}
          </WordCorrectCard>
        </ListLayout>
      ) : (
        <ListLayout>
          <Index>{index + 1}.</Index>
          <WordWrongCard $isFocusWord={isFocusWord} onClick={onClick}>
            {word}
          </WordWrongCard>
        </ListLayout>
      )}
    </>
  );
};

export default WordTestResultWordList;

const ListLayout = styled.div`
  width: 85%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const WordCorrectCard = styled.div<{ $isFocusWord: boolean }>`
  text-align: center;
  border: 0.125rem solid ${(props) => props.theme.colors.primary};
  border-radius: 0.5rem;
  margin: 1rem;
  padding: 1rem 3rem;
  width: 100%;
  cursor: pointer;
  font-size: 1.125rem;
  font-weight: 800;
  color: ${(props) => props.theme.colors.primary};

  &:hover {
    color: white;
    background-color: ${(props) => props.theme.colors.primaryPress};
    border: 0.125rem solid ${(props) => props.theme.colors.primaryPress};
  }
  /* isFocusWord true일 때 하이라이트 */
  ${({ $isFocusWord, theme }) =>
    $isFocusWord &&
    `
    color: white;
    background-color: ${theme.colors.primaryPress};
    border: 0.125rem solid ${theme.colors.primaryPress};
  `}
`;

const WordWrongCard = styled.div<{ $isFocusWord: boolean }>`
  text-align: center;
  border: 0.125rem solid ${(props) => props.theme.colors.danger};
  border-radius: 0.5rem;
  margin: 1rem;
  padding: 1rem 3rem;
  width: 100%;
  cursor: pointer;
  font-size: 1.125rem;
  font-weight: 800;
  color: ${(props) => props.theme.colors.danger};

  &:hover {
    color: white;
    background-color: ${(props) => props.theme.colors.dangerPress};
    border: 0.125rem solid ${(props) => props.theme.colors.dangerPress};
  }
  /* isFocusWord true일 때 하이라이트 */
  ${({ $isFocusWord, theme }) =>
    $isFocusWord &&
    `
    color: white;
    background-color: ${theme.colors.dangerPress};
    border: 0.125rem solid ${theme.colors.dangerPress};
  `}
`;

const Index = styled.div`
  font-size: 1.25rem;
  font-weight: 800;
  width: 4%;
`;
