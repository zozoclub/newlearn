import React from "react";
import styled from "styled-components";

type Props = {
  answerWord: string;
  userAnswer: string;
  sentence: string;
  articleId?: number;
  isCorrect: boolean;
};

const WordTestResultWordDetail: React.FC<Props> = ({
  answerWord,
  userAnswer,
  sentence,
  articleId,
  isCorrect
}) => {

  const highlightWordInSentence = (sentence: string, word: string) => {
    const parts = sentence.split(new RegExp(`(${word})`, 'gi')); // 단어로 split, 대소문자 무시
    return parts.map((part, index) =>
      part.toLowerCase() === word.toLowerCase() ? (
        <HighlightedWord key={index} $isCorrect={isCorrect}>
          {part}
        </HighlightedWord>
      ) : (
        <span key={index}>{part}</span>
      )
    );
  };

  return (
    <DetailLayout>
      <br />
      <AnswerTitle>Quiz Sentence</AnswerTitle>
      <br />
      <br />
      <AnswerContent>{highlightWordInSentence(sentence, answerWord)}</AnswerContent>
      <br />
      <br />
      <AnswerTitle>Quiz Answer</AnswerTitle>
      <br />
      <br />
      <ProblemAnswer>{answerWord}</ProblemAnswer>
      <br />
      <br />
      <br />
      <AnswerTitle>My Answer</AnswerTitle>
      <br />
      <br />
      <UserAnswer>{userAnswer}</UserAnswer>
      <br />
      <br />
      <ArticleLink>기사로 이동하기{articleId}</ArticleLink>
    </DetailLayout>
  );
};

export default WordTestResultWordDetail;

const DetailLayout = styled.div`
  margin: 1.5rem;
  text-align: start;
`;

const AnswerTitle = styled.div`
  font-size: 2rem;
  font-weight: 600;
`;

const AnswerContent = styled.div`
  font-size: 1.25rem;
`;

const ProblemAnswer = styled.div`
  font-size: 1.25rem;
`;

const UserAnswer = styled.div`
  font-size: 1.25rem;
`;

const ArticleLink = styled.div`
  font-size: 1rem;
  color: gray;
`;

const HighlightedWord = styled.span<{ $isCorrect: boolean }>`
  color: ${(props) =>
    props.$isCorrect ? props.theme.colors.primary : props.theme.colors.danger};
  font-weight: bold;
`;