import styled from "styled-components";

import PuzzleIcon from "@assets/icons/puzzleIcon.png";

const Profile = () => {
  return (
    <>
      <ProfileImage $persentage={25}>
        <img src={PuzzleIcon} />
      </ProfileImage>
      <div>Lv.32 Coding Larva</div>
      <ReadStatus>
        <div>
          <ReadStatusTag>Read</ReadStatusTag>
          <ReadStatusNum>20</ReadStatusNum>
        </div>
        <div>
          <ReadStatusTag>Speak</ReadStatusTag>
          <ReadStatusNum>32</ReadStatusNum>
        </div>
        <div>
          <ReadStatusTag>Scrap</ReadStatusTag>
          <ReadStatusNum>17</ReadStatusNum>
        </div>
      </ReadStatus>
    </>
  );
};

const ProfileImage = styled.div<{ $persentage: number }>`
  position: relative;
  border-radius: 100%;
  width: 50%;
  height: 50%;
  margin: 1rem 0 0.5rem 0;
  background: conic-gradient(
    ${(props) => props.theme.colors.primary} 0% ${(props) => props.$persentage}%,
    transparent 25% 100%
  );
  img {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 80%;
    height: 80%;
    transform: translate(-50%, -50%);
    border-radius: 100%;
    background-color: #ffffff;
  }
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
