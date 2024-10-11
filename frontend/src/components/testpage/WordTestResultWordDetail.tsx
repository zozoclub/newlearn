import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

type Props = {
  newsId: number;
  answerWord: string;
  userAnswer: string;
  sentence: string;
  sentenceMeaning: string;
  difficulty: number;
  isCorrect: boolean;
};

const WordTestResultWordDetail: React.FC<Props> = ({
  newsId,
  answerWord,
  userAnswer,
  sentence,
  sentenceMeaning,
  difficulty,
  isCorrect
}) => {
  const navigate = useNavigate();

  const toNewsDetailHandler = () => {
    navigate(`/news/detail/${newsId}`);
  };

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
      <Section>
      <DifficultyChip $difficulty={difficulty}>
        {difficulty === 1
          ? "초급"
          : difficulty === 2
            ? "중급"
            : difficulty === 3
              ? "고급"
              : "알 수 없음"}
      </DifficultyChip>
        <AnswerTitle>Quiz Sentence</AnswerTitle>
        <br />
        <AnswerContent>{highlightWordInSentence(sentence, answerWord)}</AnswerContent>
        <SentenceMeaning>{sentenceMeaning}</SentenceMeaning>
      </Section>
      <br />
      <Section>
        <AnswerTitle>Quiz Answer</AnswerTitle>
        <br />
        <ProblemAnswer>{answerWord}</ProblemAnswer>
        <br />
      </Section>

      <Section>
        <AnswerTitle>My Answer</AnswerTitle>
        <br />
        <UserAnswer $isCorrect={isCorrect}>{userAnswer ? userAnswer : "No Answer"}</UserAnswer>
        <br />
      </Section>

      <NewsLinkButton onClick={toNewsDetailHandler}>
        원문 보기
      </NewsLinkButton>
    </DetailLayout>
  );
};

export default WordTestResultWordDetail;

const DetailLayout = styled.div`
  margin: 1.5rem;
  padding: 1.5rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease-in-out;
  text-align: start;
`;

const Section = styled.div`
  margin-bottom: 2rem;
  line-height: 1.5rem;
`;

const AnswerTitle = styled.div`
  font-size: 1.75rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text};
`;

const AnswerContent = styled.div`
  font-size: 1.25rem;
  color: ${(props) => props.theme.colors.text};
`;

const SentenceMeaning = styled.div`
  font-size: 1rem;
  color: ${(props) => props.theme.colors.text04};
  margin-top: 0.75rem;
`;

const ProblemAnswer = styled.div`
  font-size: 1.25rem;
  font-weight: bold;
  color: ${(props) => props.theme.colors.primary};
`;

const UserAnswer = styled.div<{ $isCorrect: boolean }>`
  font-size: 1.25rem;
  font-weight: bold;
  color: ${(props) => (props.$isCorrect ? props.theme.colors.primary : props.theme.colors.danger)};
`;

const NewsLinkButton = styled.button`
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) => props.theme.colors.primaryPress};
  }
`;

const HighlightedWord = styled.span<{ $isCorrect: boolean }>`
  color: ${(props) =>
    props.$isCorrect ? props.theme.colors.primary : props.theme.colors.danger};
  font-weight: bold;
`;

const DifficultyChip = styled.div<{ $difficulty: number }>`
background-color: ${({ $difficulty }) =>
    $difficulty === 1 ? "#4caf50" : $difficulty === 2 ? "#ff9800" : "#f44336"};
color: white;
width: 2rem;
text-align: center;
margin-bottom: 1rem;
padding: 0.25rem 0.5rem;
border-radius: 0.5rem;
font-size: 0.875rem;
font-weight: bold;
`;