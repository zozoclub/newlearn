import React from "react";
import styled from "styled-components";

type Props = {
  word: string;
  onClick: () => void;
};

const WordTestResultWordList: React.FC<Props> = ({ word, onClick }) => {
  return <WordCard onClick={onClick}>{word}</WordCard>;
};

export default WordTestResultWordList;

const WordCard = styled.div``;
