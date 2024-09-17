import defaultProfile from "@assets/images/defaultProfile.jpg";
import styled from "styled-components";
import EditIcon from "@assets/icons/EditIcon";
import SocialNaver from "@assets/icons/SocialNaver";
import SocialKakao from "@assets/icons/SocialKakao";

// interface Profile {
//   profileImg?: string;
//   level: number;
//   nickname: string;
//   experience: number;
//   name: string;
//   social: string;
//   email: string;
// }

const MyPageProfile: React.FC = () => {
  const profileImg = defaultProfile;
  const level = 10;
  const nickname = "뉴런영어";
  const experience = 300;
  const name = "허세령";
  const social = "네이버";
  const email = "asdf@gmail.com";
  const percentage = (300 / 500) * 100;

  const handleNicknameEdit = () => {
    alert("편집 버튼 클릭");
  };
  return (
    <div>
      <Container>
        <ProfileImgContainer src={profileImg} alt="프로필사진" />
        <ProfileInfoContainer>
          <NicknameContainer>
            <div>
              Lv.{level} {nickname}
            </div>
            <EditIcon onClick={handleNicknameEdit} />
          </NicknameContainer>
          <ExperienceContainer>
            <ExperienceBarContainer>
              <ExperienceBarFill width={percentage} />
            </ExperienceBarContainer>
            <ExperienceText>{`${experience} / ${experience}`}</ExperienceText>
          </ExperienceContainer>
          <SocialInfoContainer>
            {name}
            {social === "네이버" ? <SocialNaver /> : <SocialKakao />}
          </SocialInfoContainer>
          <SocialInfoContainer>{email}</SocialInfoContainer>
        </ProfileInfoContainer>
      </Container>
    </div>
  );
};

export default MyPageProfile;

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
`;

const ProfileImgContainer = styled.img`
  width: 11rem;
`;

const ProfileInfoContainer = styled.div`
  margin: 1rem 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
// 닉네임
const NicknameContainer = styled.div`
  display: flex;
  font-size: 1.5rem;
  font-weight: bold;
  justify-content: space-between;
`;

// 경험치
const ExperienceContainer = styled.div`
  width: 90%;
  display: flex;
  gap: 1rem;
`;

const ExperienceBarContainer = styled.div`
  width: 100%;
  height: 1.25rem;
  background-color: ${(props) => props.theme.colors.cancel};
  border-radius: 5px;
  overflow: hidden;
`;

const ExperienceBarFill = styled.div<{ width: number }>`
  height: 1.25rem;
  width: ${(props) => props.width}%;
  background-color: ${(props) => props.theme.colors.primary};
  transition: width 0.5s ease-in-out;
`;

const ExperienceText = styled.div`
  font-size: 0.9rem;
  white-space: nowrap;

  margin-top: 0.25rem;
`;

// 이름, 네이버&카카오, 이메일
const SocialInfoContainer = styled.div`
  display: flex;
  font-size: 1.25rem;
  align-items: center;
  gap: 0.5rem;
`;
