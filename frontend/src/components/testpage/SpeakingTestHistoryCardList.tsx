import React from "react";
import styled from "styled-components";

import PerfectStamp from "@assets/icons/PerfectStamp";
import GreatStamp from "@assets/icons/GreatStamp";
import GoodStamp from "@assets/icons/GoodStamp";
import BadStamp from "@assets/icons/BadStamp";
import { useNavigate } from "react-router-dom";
import SpeakingTestHistoryCardChart from "./SpeakingTestHistoryCardChart";

type Props = {
  date: string;
  audioFileId: number;
  totalScore: number;
  accuracyScore: number;
  fluencyScore: number;
  prosodyScore: number;
  completenessScore: number;
};

const SpeakingTestHistoryCardList: React.FC<Props> = ({
  date,
  totalScore,
  audioFileId,
  accuracyScore,
  fluencyScore,
  prosodyScore,
  completenessScore,
}) => {
  const navigate = useNavigate();

  const intoDetailHandler = () => {
    navigate(`/speaking/result/${audioFileId}`);
  };

  const renderStamp = () => {
    if (totalScore > 90) return <ResponsiveIcon as={PerfectStamp} />;
    if (totalScore > 80) return <ResponsiveIcon as={GreatStamp} />;
    if (totalScore > 70) return <ResponsiveIcon as={GoodStamp} />;
    return <ResponsiveIcon as={BadStamp} />;
  };

  return (
    <MainContainer onClick={intoDetailHandler}>
      <ListDetailContainer>
        <ScoreContainer>
          <RingChartContainer>
            <SpeakingTestHistoryCardChart
              accuracyScore={accuracyScore}
              fluencyScore={fluencyScore}
              prosodyScore={prosodyScore}
              completenessScore={completenessScore}
            />
          </RingChartContainer>
          <ScoreText>
            총합<ScoreSpan>{totalScore}</ScoreSpan> 점
          </ScoreText>
        </ScoreContainer>
      </ListDetailContainer>
      <DateContainer>{date}</DateContainer>
      <ScoreStamp>{renderStamp()}</ScoreStamp>
    </MainContainer>
  );
};

export default SpeakingTestHistoryCardList;

const ResponsiveIcon = styled.div`
  width: 3rem;
  height: 3rem;

  @media (max-width: 768px) {
    width: 2rem;
    height: 2rem;
  }

  @media (max-width: 480px) {
    width: 1rem;
    height: 1rem;
  }
`;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 90%;
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
    width: 100%;
    min-height: 4rem;
  }
`;

const ListDetailContainer = styled.div`
  flex-direction: column;
  align-items: center;
  position: relative;
  width: 100%;
`;

const DateContainer = styled.div`
  font-size: 1rem;
  font-weight: 300;
  position: absolute;
  bottom: 0.5rem;
  right: 1rem;
  color: gray;
  @media (max-width: 768px) {
   font-size: 0.875rem; 
  }
`;

const ScoreContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ScoreStamp = styled.div`
  position: absolute;
  top: -1.125rem;
  right: -0.5rem;
`;

const ScoreSpan = styled.span`
  margin: 0 0.5rem;
  font-size: 2rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.primary};
`;

const RingChartContainer = styled.div`
  margin-left: 2rem;
  margin-right: 2rem;
  height: 7rem;
  @media (max-width: 1280px) {
    height: 6rem;
    margin-left: 1rem;
    margin-right: 1rem;
  }
  @media (max-width: 768px) {
    height: 5rem;
  }
  @media (max-width: 500px) {
    height: 4rem;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
  }
`;
const ScoreText = styled.p`
  align-items: end; /* 세로 중앙 정렬 */
  font-size: 1.5rem;
  font-weight: 600;
  padding-right: 11rem;
  margin: auto;
  @media (max-width: 1280px) {
    font-size: 1.25rem;
    padding-right: 8rem;
  }
  @media (max-width: 768px) {
    font-size: 1.125rem;
    padding-right: 7rem;
  }
  @media (max-width: 500px) {
    padding-right: 5rem;
  }
`;
