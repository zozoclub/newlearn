import React from "react";
import styled from "styled-components";

import PerfectStamp from "@assets/icons/PerfectStamp";
import GreatStamp from "@assets/icons/GreatStamp";
import GoodStamp from "@assets/icons/GoodStamp";
import BadStamp from "@assets/icons/BadStamp";

import { useNavigate } from "react-router-dom";

type Props = {
  score: number;
  date: string;
  quizId?: number;
};

const WordTestHistoryCardList: React.FC<Props> = ({ date, score, quizId }) => {
  const navigate = useNavigate();

  const intoDetailHandler = () => {
    navigate(`/word/result/${quizId}`);
  };
  // 이후 prop 받아서 클릭될 Id 값
  const renderStamp = () => {
    if (score > 90) return <PerfectStamp />;
    if (score > 80) return <GreatStamp />;
    if (score > 70) return <GoodStamp />;
    return <BadStamp />;
  };

  return (
    <MainContainer onClick={intoDetailHandler}>
      <ListDetailContainer>
        <ScoreContainer>
          <ScoreSpan>{score}</ScoreSpan>
          <div style={{ marginBottom: "0.375rem" }}>점</div>
        </ScoreContainer>
      </ListDetailContainer>
      <DateContainer>{date}</DateContainer>
      <ScoreStamp>{renderStamp()}</ScoreStamp>
    </MainContainer>
  );
};

export default WordTestHistoryCardList;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 80%;
  min-height: 8rem;
  margin: 0.625rem;
  padding: 0.625rem;
  background-color: ${(props) => props.theme.colors.newsItemBackground};
  backdrop-filter: blur(0.25rem);
  border-radius: 0.75rem;
  transition: background-color 0.5s ease, box-shadow 0.5s ease;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => props.theme.colors.newsItemBackgroundPress};
  }

  @media (max-width: 768px) {
    width: 70%;
    min-height: 3rem;
    padding: 2rem 1.25rem;
  }
`;

const ListDetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  width: 100%;
`;

const DateContainer = styled.div`
  font-size: 1rem;
  font-weight: 300;
  position: absolute;
  margin-bottom: 0.25rem;
  bottom: 0.5rem;
  right: 1rem;
  color: gray;
  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const ScoreContainer = styled.div`
  display: flex;
  padding: 25% 0;
  justify-content: center;
  font-size: 1.125rem;
  align-items: end;
  gap: 0.25rem;
`;

const ScoreStamp = styled.div`
  position: absolute;
  top: -1.125rem;
  right: -1.125rem;

  @media (max-width: 768px) {
  }
`;

const ScoreSpan = styled.span`
  font-size: 3rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.primary};
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;
