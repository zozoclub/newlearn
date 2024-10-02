import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { PointRankingType, ReadRankingType } from "./TopRankingWidget";
import Spinner from "@components/Spinner";
import { calculateExperience } from "@utils/calculateExperience";
import { useRecoilValue } from "recoil";
import { selectedRankingState } from "@store/selectedRankingState";
import LevelIcon from "@components/common/LevelIcon";

const RankingWidget: React.FC<{
  pointIsLoading: boolean;
  readIsLoading: boolean;
  pointRankingList: PointRankingType[] | undefined;
  readRankingList: ReadRankingType[] | undefined;
}> = ({ pointIsLoading, readIsLoading, pointRankingList, readRankingList }) => {
  const selectedType = useRecoilValue(selectedRankingState);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(false);
    const timer = setTimeout(() => {
      if (!pointIsLoading && !readIsLoading) {
        setAnimate(true);
      }
    }, 100); // 리렌더링을 확실하게 하기 위한 딜레이

    return () => clearTimeout(timer);
  }, [pointIsLoading, readIsLoading, selectedType]);

  const renderRankingList = (
    list: PointRankingType[] | ReadRankingType[] | undefined
  ) => {
    return list?.map((ranking, index) => (
      <Ranking
        key={`${selectedType}-${index}`}
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        <div className="rank">{index + 1}</div>
        <div className="level">
          <LevelIcon
            level={calculateExperience(ranking.experience).level}
            size={25}
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
      {selectedType === "point" ? (
        pointIsLoading ? (
          <LoadingDiv>
            <Spinner />
          </LoadingDiv>
        ) : (
          animate && renderRankingList(pointRankingList)
        )
      ) : readIsLoading ? (
        <LoadingDiv>
          <Spinner />
        </LoadingDiv>
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
  animation: ${slideIn} 0.5s ease-out forwards;
  opacity: 0;

  .rank {
    width: 10%;
  }
  .level {
    width: 15%;
  }
  .nickname {
    width: 50%;
    text-align: start;
    overflow: hidden;
  }
  .point {
    width: 25%;
    text-align: start;
  }
`;

const LoadingDiv = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export default RankingWidget;
