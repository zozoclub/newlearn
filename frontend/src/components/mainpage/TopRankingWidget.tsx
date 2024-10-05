import Spinner from "@components/Spinner";
import styled, { keyframes } from "styled-components";
import firstRankIcon from "@assets/icons/firstIcon.png";
import secondRankIcon from "@assets/icons/secondIcon.png";
import thirdRankIcon from "@assets/icons/thirdIcon.png";
import Avatar, { AvatarType } from "@components/common/Avatar";
import { useRecoilState } from "recoil";
import { selectedRankingState } from "@store/selectedRankingState";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserAvatar } from "@services/userService";
import LevelIcon from "@components/common/LevelIcon";
import { calculateExperience } from "@utils/calculateExperience";
import RankingWidget from "./RankingWidget";

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
          selectedType === "point"
            ? pointRankingList![0].userId
            : readRankingList![0].userId
        ),
      enabled:
        selectedType === "point"
          ? pointRankingList !== undefined && pointRankingList.length > 0
          : readRankingList !== undefined && readRankingList.length > 0,
    });

  const { isLoading: secondIsLoading, data: secondUserAvatar } =
    useQuery<AvatarType>({
      queryKey: ["getSecondUserAvatar", selectedType],
      queryFn: () =>
        getUserAvatar(
          selectedType === "point"
            ? pointRankingList![1].userId
            : readRankingList![1].userId
        ),
      enabled:
        selectedType === "point"
          ? pointRankingList !== undefined && pointRankingList.length > 0
          : readRankingList !== undefined && readRankingList.length > 0,
    });

  const { isLoading: thirdIsLoading, data: thirdUserAvatar } =
    useQuery<AvatarType>({
      queryKey: ["getThirdUserAvatar", selectedType],
      queryFn: () =>
        getUserAvatar(
          selectedType === "point"
            ? pointRankingList![2].userId
            : readRankingList![2].userId
        ),
      enabled:
        selectedType === "point"
          ? pointRankingList !== undefined && pointRankingList.length > 2
          : readRankingList !== undefined && readRankingList.length > 2,
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
      <HorizontalLayout>
        <TopRankingWrapper>
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
        </TopRankingWrapper>
        <RankingWidgetWrapper>
          <RankingWidget
            pointIsLoading={pointIsLoading}
            pointRankingList={pointRankingList}
            readIsLoading={readIsLoading}
            readRankingList={readRankingList}
          />
        </RankingWidgetWrapper>
      </HorizontalLayout>
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
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const RankingKindContainer = styled.div<{ $type: "point" | "read" }>`
  position: absolute;
  width: 10rem;
  height: 1rem;
  margin: 0 auto;
  padding: 0.5rem 1rem;
  color: white;
  border-radius: 1rem;
  background-color: white;
  font-weight: 500;
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
    width: 4.5rem;
    height: 1rem;
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
  height: 1rem;
  padding: 0 0.75rem;
  color: ${(props) => (props.$isSelected ? "white" : "black")};
  transition: color 0.5s;
  font-size: 1.125rem;
  text-align: center;
  left: ${(props) => (props.$type === "point" ? 0 : "6rem")};
`;

const TopRanking = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  height: 90%;
`;

const RankStand = styled.div<{ $animate: boolean }>`
  text-align: center;
  top: 1rem;
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
    bottom: 80%;
    width: 120%;
    text-align: center;
    white-space: nowrap;
    overflow: visible;
  }
  .avatar {
    bottom: calc(50% - 2rem);
  }
  .user-info {
    display: grid;
    place-items: center;
    position: absolute;
    width: 100%;
    height: 50%;
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
    bottom: 70%;
    width: 120%;
    text-align: center;
    white-space: nowrap;
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
    border-right: 0px;
  }
`;

const ThirdRank = styled(RankStand)`
  left: 67%;
  .nickname {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 65%;
    width: 120%;
    text-align: center;
    white-space: nowrap;
    overflow: visible;
  }
  .avatar {
    bottom: calc(35% - 2rem);
  }
  .user-info {
    display: grid;
    place-items: center;
    position: absolute;
    width: 100%;
    height: 35%;
    bottom: 0;
    border: solid 2px;
    border-bottom: 0px;
    border-left: 0px;
  }
`;

const LoadingDiv = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const HorizontalLayout = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  margin-top: 1.75rem;
`;

const TopRankingWrapper = styled.div`
  width: 50%; // 필요에 따라 조정
`;

const RankingWidgetWrapper = styled.div`
  width: 45%; // 필요에 따라 조정
  margin-top: 1rem;
`;

export default TopRankingWidget;
