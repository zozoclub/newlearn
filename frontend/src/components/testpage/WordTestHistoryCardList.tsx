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
    <MainContainer>
      <ListDetailContainer>
        <DateContainer>{date}</DateContainer>
        <ScoreContainer>
          <ScoreSpan>{score}</ScoreSpan>점
        </ScoreContainer>
        <DetailButtonContainer>
          <IntoDetailButton onClick={intoDetailHandler}>
            상세보기
          </IntoDetailButton>
        </DetailButtonContainer>
      </ListDetailContainer>
      <ScoreStamp>{renderStamp()}</ScoreStamp>
    </MainContainer>
  );
};

export default WordTestHistoryCardList;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 20%;
  min-height: 12rem;
  margin: 0.625rem;
  padding: 0.625rem;
  background-color: ${(props) => props.theme.colors.cardBackground + "5A"};
  border-radius: 0.75rem;
  box-shadow: ${(props) => props.theme.shadows.small};
  transition: box-shadow 0.5s;
`;

const ListDetailContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const DateContainer = styled.div`
  font-size: 0.875rem;
  font-weight: 200;
  margin-bottom: 0.5rem;
`;

const ScoreContainer = styled.div`
  display: flex;
  padding-top: 30%;
  padding-bottom: 20%;
  justify-content: center;
  align-items: end;
`;

const ScoreStamp = styled.div`
  position: absolute;
  top: -1.125rem;
  right: -1.125rem;
`;

const ScoreSpan = styled.span`
  font-size: 3rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.primary};
`;

const DetailButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1rem;
`;

const IntoDetailButton = styled.button`
  padding: 0.5rem 0.5rem;
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 0.625rem;
  font-size: 0.875rem;
  font-weight: bold;
  transition: background-color 0.3s ease;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => props.theme.colors.primaryPress};
  }
`;
