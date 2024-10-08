import { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { PointRankingType, ReadRankingType } from "./RankingWidget";
import Spinner from "@components/Spinner";
import { calculateExperience } from "@utils/calculateExperience";
import { useRecoilValue } from "recoil";
import { selectedRankingState } from "@store/selectedRankingState";
import LevelIcon from "@components/common/LevelIcon";
import { useRankings } from "@hooks/useRankings";

const RankingList = () => {
  const { pointIsLoading, readIsLoading, pointRankingList, readRankingList } =
    useRankings();
  const selectedType = useRecoilValue(selectedRankingState);
  const [animate, setAnimate] = useState(false);
  const isLoading = pointIsLoading || readIsLoading;

  useEffect(() => {
    setAnimate(false);
    const timer = setTimeout(() => {
      if (!isLoading) {
        setAnimate(true);
      }
    }, 100); // 리렌더링을 확실하게 하기 위한 딜레이

    return () => clearTimeout(timer);
  }, [isLoading, selectedType]);

  const renderRankingList = (
    list: PointRankingType[] | ReadRankingType[] | undefined
  ) => {
    return list?.slice(0, 5).map((ranking, index) => (
      <Ranking key={index} style={{ animationDelay: `${index * 0.1}s` }}>
        <div className="level">
          <LevelIcon
            level={calculateExperience(ranking.experience).level}
            size={28}
          />
        </div>
        <div className="nickname">{ranking.nickname}</div>
        <div className="point">
          {selectedType === "point"
            ? (ranking as PointRankingType).experience
            : (ranking as ReadRankingType).totalNewsReadCount}
        </div>
      </Ranking>
    ));
  };

  return (
    <Container>
      {isLoading ? (
        <LoadingDiv>
          <Spinner />
        </LoadingDiv>
      ) : selectedType === "point" ? (
        animate && renderRankingList(pointRankingList)
      ) : (
        animate && renderRankingList(readRankingList)
      )}
    </Container>
  );
};

const slideIn = keyframes`
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 90%;
  height: 95%;
  padding: 2.5% 5%;
  overflow: hidden;
`;

const Ranking = styled.div`
  display: flex;
  justify-items: center;
  align-items: center;
  text-align: center;
  margin-bottom: 1rem;
  font-weight: 600;
  font-size: 1.125rem;
  animation: ${slideIn} 0.5s ease-out forwards;
  opacity: 0;

  .level {
    width: 20%;
  }
  .nickname {
    width: 55%;
    text-align: start;
    overflow: hidden;
  }
  .point {
    width: 25%;
    text-align: center;
  }
`;

const LoadingDiv = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export default RankingList;
