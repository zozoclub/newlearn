import Spinner from "@components/Spinner";
import styled, { keyframes } from "styled-components";
import firstRankIcon from "@assets/icons/first-rank.svg";
import secondRankIcon from "@assets/icons/second-rank.svg";
import thirdRankIcon from "@assets/icons/third-rank.svg";
import Avatar from "@components/common/Avatar";
import { useRecoilState } from "recoil";
import { selectedRankingState } from "@store/selectedRankingState";
import { useEffect, useState } from "react";

type RankingType = {
  userId: number;
  nickname: string;
  ranking: number;
};

export type PointRankingType = RankingType & {
  experience: number;
};

export type ReadRankingType = RankingType & {
  experience: number;
  totalNewsReadCount: number;
};

const TopRankingWidget: React.FC<{
  pointIsLoading: boolean;
  readIsLoading: boolean;
  pointRankingList: PointRankingType[] | undefined;
  readRankingList: ReadRankingType[] | undefined;
}> = ({ pointIsLoading, readIsLoading, pointRankingList, readRankingList }) => {
  const [selectedType, setSelectedType] = useRecoilState(selectedRankingState);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(false);
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 50);
    return () => clearTimeout(timer);
  }, [selectedType]);

  const renderRankings = (
    rankings: PointRankingType[] | ReadRankingType[] | undefined
  ) => {
    if (!rankings || rankings.length < 3) return null;
    return (
      <>
        <FirstRank $animate={animate}>
          <div className="nickname">
            <div>{rankings[0].nickname}</div>
          </div>
          <div className="avatar">
            <Avatar avatar={{ skin: 0, eyes: 0, mask: 0 }} size={4} />
          </div>
          <div className="user-info">
            <img src={firstRankIcon} alt="first-rank" />
          </div>
        </FirstRank>
        <SecondRank $animate={animate}>
          <div className="nickname">
            <div>{rankings[1].nickname}</div>
          </div>
          <div className="avatar">
            <Avatar avatar={{ skin: 0, eyes: 0, mask: 0 }} size={4} />
          </div>
          <div className="user-info">
            <img src={secondRankIcon} alt="second-rank" />
          </div>
        </SecondRank>
        <ThirdRank $animate={animate}>
          <div className="nickname">
            <div>{rankings[2].nickname}</div>
          </div>
          <div className="avatar">
            <Avatar avatar={{ skin: 0, eyes: 0, mask: 0 }} size={4} />
          </div>
          <div className="user-info">
            <img src={thirdRankIcon} alt="third-rank" />
          </div>
        </ThirdRank>
      </>
    );
  };

  return (
    <Container>
      <RankingKindContainer $type={selectedType}>
        <RankingKind
          $isSelected={selectedType === "point"}
          $type="point"
          onClick={() => setSelectedType("point")}
        >
          포인트왕
        </RankingKind>
        <RankingKind
          $isSelected={selectedType === "read"}
          $type="read"
          onClick={() => setSelectedType("read")}
        >
          다독왕
        </RankingKind>
      </RankingKindContainer>
      <TopRanking>
        {selectedType === "point" ? (
          pointIsLoading ? (
            <LoadingDiv>
              <Spinner />
            </LoadingDiv>
          ) : (
            renderRankings(pointRankingList)
          )
        ) : readIsLoading ? (
          <LoadingDiv>
            <Spinner />
          </LoadingDiv>
        ) : (
          renderRankings(readRankingList)
        )}
      </TopRanking>
    </Container>
  );
};

const popIn = keyframes`
  0% {
    transform: scale(0);
    opacity: 0;
  }
  70% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const Container = styled.div`
  width: 90%;
  height: 90%;
  padding: 5%;
`;

const RankingKindContainer = styled.div<{ $type: "point" | "read" }>`
  position: relative;
  width: 9rem;
  height: 0.875rem;
  margin: auto;
  padding: 0.5rem 2rem;
  color: white;
  border-radius: 1rem;
  box-shadow: gray 0px 0px 2px 2px inset;
  background-color: white;
  cursor: pointer;
  &::after {
    content: "";
    position: absolute;
    transform: ${(props) =>
      props.$type === "point" ? "translateX(0)" : "translateX(6rem)"};
    transition: transform 0.5s;
    top: 0;
    left: 0;
    border-radius: 1rem;
    background-color: ${(props) => props.theme.colors.primary};
    width: 5rem;
    height: 0.875rem;
    padding: 0.5rem 1rem;
  }
`;

const RankingKind = styled.div<{
  $isSelected: boolean;
  $type: "point" | "read";
}>`
  position: absolute;
  z-index: 1;
  width: 5rem;
  height: 0.875rem;
  padding: 0.5rem 1rem;
  transform: translate(0, -50%);
  color: ${(props) => (props.$isSelected ? "white" : "black")};
  transition: color 0.5s;
  font-size: 0.875rem;
  text-align: center;
  top: 50%;
  left: ${(props) => (props.$type === "point" ? 0 : "6rem")};
`;

const TopRanking = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  height: 90%;
`;

const RankStand = styled.div<{ $animate: boolean }>`
  position: absolute;
  width: 33%;
  height: 100%;
  font-size: 0.875rem;
  text-align: center;

  .avatar {
    position: absolute;
    width: 100%;
    opacity: 0;
    transform: scale(0);
    animation: ${({ $animate }) => ($animate ? popIn : "none")} 0.5s forwards;
    animation-delay: 0.2s;
  }
`;

const FirstRank = styled(RankStand)`
  left: 50%;
  transform: translateX(-50%);
  .nickname {
    display: flex;
    position: absolute;
    justify-content: center;
    width: 100%;
    bottom: 80%;
  }
  .avatar {
    bottom: calc(40% - 2rem);
  }
  .user-info {
    display: grid;
    place-items: center;
    position: absolute;
    width: 100%;
    height: 40%;
    bottom: 0;
    border: solid 1px;
    border-bottom: 0px;
  }
`;

const SecondRank = styled(RankStand)`
  .nickname {
    position: absolute;
    display: flex;
    justify-content: center;
    width: 100%;
    bottom: 70%;
  }
  .avatar {
    bottom: calc(30% - 2rem);
  }
  .user-info {
    display: grid;
    place-items: center;
    position: absolute;
    width: 100%;
    height: 30%;
    bottom: 0;
    border: solid 1px;
    border-bottom: 0px;
  }
`;

const ThirdRank = styled(RankStand)`
  left: 67%;
  .nickname {
    position: absolute;
    display: flex;
    justify-content: center;
    width: 100%;
    bottom: 65%;
  }
  .avatar {
    bottom: calc(25% - 2rem);
  }
  .user-info {
    display: grid;
    place-items: center;
    position: absolute;
    width: 100%;
    height: 25%;
    bottom: 0;
    border: solid 1px;
    border-bottom: 0px;
  }
`;

const LoadingDiv = styled.td`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export default TopRankingWidget;
