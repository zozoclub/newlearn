import Avatar, { AvatarType } from "@components/common/Avatar";
import { getUserAvatar } from "@services/userService";
import { selectedRankingState } from "@store/selectedRankingState";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import styled, { keyframes } from "styled-components";
import { PointRankingType, ReadRankingType } from "./RankingWidget";
import LevelIcon from "@components/common/LevelIcon";
import { calculateExperience } from "@utils/calculateExperience";
import firstRankIcon from "@assets/icons/firstIcon.png";
import secondRankIcon from "@assets/icons/secondIcon.png";
import thirdRankIcon from "@assets/icons/thirdIcon.png";
import Spinner from "@components/Spinner";
import { useRankings } from "@hooks/useRankings";

const TopRanking = () => {
  const { pointIsLoading, readIsLoading, pointRankingList, readRankingList } =
    useRankings();
  const [animate, setAnimate] = useState(false);
  const [selectedType] = useRecoilValue(selectedRankingState);
  const isLoading = pointIsLoading || readIsLoading;

  // 랭킹 유형 변경 시 animation
  useEffect(() => {
    setAnimate(false);
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 50);
    return () => clearTimeout(timer);
  }, [selectedType]);
  const { isLoading: firstIsLoading, data: firstUserAvatar } =
    useQuery<AvatarType>({
      queryKey: ["getFirstUserAvatar", selectedType],
      queryFn: () =>
        getUserAvatar(
          selectedType === "p"
            ? pointRankingList![0].userId
            : readRankingList![0].userId
        ),
      enabled:
        selectedType === "p"
          ? pointRankingList !== undefined && pointRankingList.length > 0
          : readRankingList !== undefined && readRankingList.length > 0,
      staleTime: 5 * 60 * 1000,
    });

  const { isLoading: secondIsLoading, data: secondUserAvatar } =
    useQuery<AvatarType>({
      queryKey: ["getSecondUserAvatar", selectedType],
      queryFn: () =>
        getUserAvatar(
          selectedType === "p"
            ? pointRankingList![1].userId
            : readRankingList![1].userId
        ),
      enabled:
        selectedType === "p"
          ? pointRankingList !== undefined && pointRankingList.length > 1
          : readRankingList !== undefined && readRankingList.length > 1,
      staleTime: 0,
    });

  const { isLoading: thirdIsLoading, data: thirdUserAvatar } =
    useQuery<AvatarType>({
      queryKey: ["getThirdUserAvatar", selectedType],
      queryFn: () =>
        getUserAvatar(
          selectedType === "p"
            ? pointRankingList![2].userId
            : readRankingList![2].userId
        ),
      enabled:
        selectedType === "p"
          ? pointRankingList !== undefined && pointRankingList.length > 2
          : readRankingList !== undefined && readRankingList.length > 2,
      staleTime: 0,
    });

  const renderRankings = (
    rankings: PointRankingType[] | ReadRankingType[] | undefined
  ) => {
    if (!rankings || rankings.length < 3) return null;
    return (
      <>
        {rankings.length > 0 && !firstIsLoading && (
          <FirstRank $animate={animate}>
            <div className="nickname">
              <div style={{ display: "flex", justifyContent: "center" }}>
                <LevelIcon
                  level={calculateExperience(rankings[0].experience).level}
                  size={32}
                />
              </div>
              <div>{rankings[0].nickname}</div>
            </div>
            <div className="avatar">
              <Avatar avatar={firstUserAvatar!} size={4} />
            </div>
            <div className="user-info">
              <img src={firstRankIcon} width={48} />
            </div>
          </FirstRank>
        )}
        {rankings.length > 1 && !secondIsLoading && (
          <SecondRank $animate={animate}>
            <div className="nickname">
              <div style={{ display: "flex", justifyContent: "center" }}>
                <LevelIcon
                  level={calculateExperience(rankings[1].experience).level}
                  size={32}
                />
              </div>
              <div>{rankings[1].nickname}</div>
            </div>
            <div className="avatar">
              <Avatar avatar={secondUserAvatar!} size={4} />
            </div>
            <div className="user-info">
              <img src={secondRankIcon} width={48} />
            </div>
          </SecondRank>
        )}
        {rankings.length > 2 && !thirdIsLoading && (
          <ThirdRank $animate={animate}>
            <div className="nickname">
              <div style={{ display: "flex", justifyContent: "center" }}>
                <LevelIcon
                  level={calculateExperience(rankings[2].experience).level}
                  size={32}
                />
              </div>
              <div>{rankings[2].nickname}</div>
            </div>
            <div className="avatar">
              <Avatar avatar={thirdUserAvatar!} size={4} />
            </div>
            <div className="user-info">
              <img src={thirdRankIcon} width={48} />
            </div>
          </ThirdRank>
        )}
      </>
    );
  };
  return (
    <Container>
      {isLoading ? (
        <LoadingDiv>
          <Spinner />
        </LoadingDiv>
      ) : selectedType === "p" ? (
        renderRankings(pointRankingList)
      ) : (
        renderRankings(readRankingList)
      )}
    </Container>
  );
};

export default TopRanking;

const Container = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  height: 90%;
`;

const LoadingDiv = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

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

const RankStand = styled.div<{ $animate: boolean }>`
  text-align: center;
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
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 70%;
    width: 120%;
    font-weight: 400;
    text-align: center;
    overflow: visible;
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
    border: solid 2px;
    border-bottom: 0px;
  }
`;

const SecondRank = styled(RankStand)`
  .nickname {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 60%;
    width: 120%;
    text-align: center;
    white-space: nowrap;
    overflow: visible;
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
    border: solid 2px;
    border-bottom: 0px;
    border-right: 0px;
  }
`;

const ThirdRank = styled(RankStand)`
  left: 67%;
  .nickname {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 55%;
    width: 120%;
    text-align: center;
    white-space: nowrap;
    overflow: visible;
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
    border: solid 2px;
    border-bottom: 0px;
    border-left: 0px;
  }
`;
