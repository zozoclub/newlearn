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
  audioFileId: number;
};

const SpeakingTestHistoryCardList: React.FC<Props> = ({
  date,
  score,
  audioFileId,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/speaking/result/${audioFileId}`);
  };

  const renderStamp = () => {
    if (score > 90) return <ResponsiveIcon as={PerfectStamp} />;
    if (score > 80) return <ResponsiveIcon as={GreatStamp} />;
    if (score > 70) return <ResponsiveIcon as={GoodStamp} />;
    return <ResponsiveIcon as={BadStamp} />;
  };

  return (
    <MainContainer onClick={handleClick}>
      <ListDetailContainer>
        <ScoreContainer>
          <ScoreSpan>{score}</ScoreSpan>점
        </ScoreContainer>
      </ListDetailContainer>
      <DateContainer>{date}</DateContainer>
      <ScoreStamp>{renderStamp()}</ScoreStamp>
    </MainContainer>
  );
};

export default SpeakingTestHistoryCardList;

// 아이콘 크기를 반응형으로 만드는 스타일
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
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  width: 100%;
`;

const DateContainer = styled.div`
  font-size: 0.875rem;
  font-weight: 200;
  position: absolute;
  bottom: 0.5rem;
  right: 1rem; 
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

  @media (max-width: 768px) {
    top: 0.5rem;
    left: 0.5rem;
  }
`;

const ScoreSpan = styled.span`
  font-size: 2rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.primary};
`;

