import styled from "styled-components";

import { useRecoilValue } from "recoil";
import userInfoState from "@store/userInfoState";
import Avatar, { AvatarType } from "./Avatar";

const Profile = () => {
  const userInfo = useRecoilValue(userInfoState);
  const avatar: AvatarType = {
    skin: userInfo.skin,
    eyes: userInfo.eyes,
    mask: userInfo.mask,
  };
  const isInitialized = userInfo.isInitialized;

  if (!isInitialized) return <div>로딩중이셈;</div>;

  return (
    <>
      <AvatarContainer $persentage={25}>
        <div className="center-circle">
          <Avatar avatar={avatar} size={6} />
        </div>
      </AvatarContainer>
      <NameDiv>
        Lv{userInfo.experience} {userInfo.nickname}
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

const AvatarContainer = styled.div<{ $persentage: number }>`
  position: relative;
  border-radius: 9rem;
  width: 9rem;
  height: 9rem;
  background: conic-gradient(
    ${(props) => props.theme.colors.primary} 0% ${(props) => props.$persentage}%,
    transparent 75% 100%
  );
  .center-circle {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 7rem;
    height: 7rem;
    background-color: white;
    border-radius: 7rem;
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
