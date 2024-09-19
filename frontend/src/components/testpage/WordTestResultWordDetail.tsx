import { toLower } from "lodash";
import React from "react";
import styled from "styled-components";

type Props = {
  answerWord: string;
  userAnswer: string;
  sentence: string;
  sentenceTranslation: string;
  articleId?: number;
};

const WordTestResultWordDetail: React.FC<Props> = ({
  answerWord,
  userAnswer,
  sentence,
  sentenceTranslation,
  articleId,
}) => {
  // TODO : 실제 DB에 저장되는 형태에 따라 함수 변형해야함 (대,소문자)
  const sentenceConvert = (sentence: string) => {
    const lowerSentence = toLower(sentence);
    return lowerSentence.replace(answerWord, "________");
  };

  return (
    <DetailLayout>
      <br />
      <AnswerTitle>Sentence</AnswerTitle>
      <br />
      <br />
      <AnswerTranslation>{sentenceConvert(sentence)}</AnswerTranslation>
      <br />
      <br />
      <AnswerTranslation>{sentenceTranslation}</AnswerTranslation>
      <br />
      <br />
      <br />
      <AnswerTitle>Problem Answer</AnswerTitle>
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

const AnswerTranslation = styled.div`
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
