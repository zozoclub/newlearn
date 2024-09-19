import React from "react";

type Props = {
  userAnswer: string;
  sentence: string;
  sentenceTranslation: string;
};

const WordTestResultWordDetail: React.FC<Props> = ({
  userAnswer,
  sentence,
  sentenceTranslation,
}) => {
  return (
    <>
      <div>정답</div>
      <div>{sentence}</div>
      <div>{sentenceTranslation}</div>
      <div>내가 쓴 답</div>
      <div>{userAnswer}</div>
    </>
  );
};

export default WordTestResultWordDetail;
