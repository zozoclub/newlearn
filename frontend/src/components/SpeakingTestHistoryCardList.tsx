import React from "react";
import styled from "styled-components";

import PerfectStamp from "@assets/icons/PerfectStamp";
import GreatStamp from "@assets/icons/GreatStamp";
import GoodStamp from "@assets/icons/GoodStamp";
import BadStamp from "@assets/icons/BadStamp";

type Props = {
  score: number;
  date: string;
};

const SpeakingTestHistoryCardList: React.FC<Props> = ({ date, score }) => {
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
      </ListDetailContainer>
      <ScoreStamp>{renderStamp()}</ScoreStamp>
    </MainContainer>
  );
};

export default SpeakingTestHistoryCardList;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 90%;
  min-height: 12rem;
  margin: 0.625rem;
  padding: 0.625rem;
  background-color: ${(props) => props.theme.colors.cardBackground + "BF"};
  backdrop-filter: blur(0.25rem);
  border-radius: 0.75rem;
  box-shadow: 0.5rem 0.5rem 0.25rem ${(props) => props.theme.colors.shadow};
  transition: box-shadow 0.5s;
`;

const ListDetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const DateContainer = styled.div`
  font-size: 0.875rem;
  font-weight: 200;
  margin-bottom: 0.5rem;
`;

const ScoreContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ScoreStamp = styled.div`
  position: absolute;
  top: -1.125rem;
  right: -1.125rem;
`;

const ScoreSpan = styled.span`
  font-size: 2rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.primary};
`;
