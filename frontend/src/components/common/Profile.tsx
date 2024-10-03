import styled, { keyframes } from "styled-components";
import { useRecoilValue } from "recoil";
import userInfoState from "@store/userInfoState";
import Avatar, { AvatarType } from "./Avatar";
import { calculateExperience } from "@utils/calculateExperience";
import Spinner from "@components/Spinner";

const Profile = () => {
  const userInfo = useRecoilValue(userInfoState);
  const avatar: AvatarType = {
    skin: userInfo.skin,
    eyes: userInfo.eyes,
    mask: userInfo.mask,
  };
  const isInitialized = userInfo.isInitialized;
  const calculatedExperience = calculateExperience(userInfo.experience);

  if (!isInitialized)
    return (
      <div>
        <Spinner />
      </div>
    );

  return (
    <>
      <AvatarContainer>
        <svg viewBox="0 0 36 36" className="circular-chart">
          <path
            className="circle"
            strokeDasharray={`${calculatedExperience.percentage}, 100`}
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <div className="center-circle">
          <Avatar avatar={avatar} size={6} />
        </div>
      </AvatarContainer>
      <NameDiv>
        Lv
        {calculatedExperience.level} {userInfo.nickname}
      </NameDiv>
      <ReadStatus>
        <div>
          <ReadStatusTag>Read</ReadStatusTag>
          <ReadStatusNum>{userInfo.totalNewsReadCount}</ReadStatusNum>
        </div>
        <div>
          <ReadStatusTag>Speak</ReadStatusTag>
          <ReadStatusNum>0</ReadStatusNum>
        </div>
        <div>
          <ReadStatusTag>Scrap</ReadStatusTag>
          <ReadStatusNum>0</ReadStatusNum>
        </div>
      </ReadStatus>
    </>
  );
};

const progressAnimation = keyframes`
  0% {
    stroke-dasharray: 0 100;
  }
`;

const AvatarContainer = styled.div`
  position: relative;
  width: 9rem;
  height: 9rem;

  .circular-chart {
    display: block;
    margin: 0 auto;
    max-width: 100%;
    max-height: 100%;
  }

  .circle-bg {
    fill: none;
    stroke: #eee;
    stroke-width: 3.8;
  }

  .circle {
    fill: none;
    stroke-width: 2.8;
    stroke-linecap: round;
    stroke: ${(props) => props.theme.colors.primary};
    animation: ${progressAnimation} 1s ease-out forwards;
  }

  .center-circle {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 7rem;
    height: 7rem;
    background-color: ${(props) => props.theme.colors.text};
    border-radius: 50%;
    overflow: hidden;
  }
`;

const NameDiv = styled.div`
  margin-top: 1rem;
`;

const ReadStatus = styled.div`
  display: flex;
  justify-content: space-between;
  width: calc(100% - 4rem);
  margin: 1rem 2rem;
  div {
    text-align: center;
    :first-child {
      margin: 0.75rem 0 0.75rem 0;
    }
  }
`;

const ReadStatusTag = styled.div`
  margin: 0.75rem 0 0.75rem 0;
  text-align: center;
`;

const ReadStatusNum = styled.div`
  text-align: center;
`;

export default Profile;
