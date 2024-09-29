import { useState, useEffect } from "react";
import styled from "styled-components";
import EditIcon from "@assets/icons/EditIcon";
import SocialNaver from "@assets/icons/SocialNaver";
import SocialKakao from "@assets/icons/SocialKakao";
import Modal from "@components/Modal";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userInfoState from "@store/userInfoState";
import { calculateExperience } from "@utils/calculateExperience";
import Avatar, { AvatarType } from "@components/common/Avatar";
import { changeNickname } from "@services/mypageService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
const MyPageProfile: React.FC = () => {
  const queryClient = useQueryClient();
  const userInfo = useRecoilValue(userInfoState);
  const setUserInfo = useSetRecoilState(userInfoState);

  const [nickname, setNickname] = useState(userInfo.nickname);
  const [tempNickname, setTempNickname] = useState(userInfo.nickname);

  // 경험치
  const calculatedExperience = calculateExperience(userInfo.experience);
  const level = calculatedExperience.level;
  const expInCurrentLevel = calculatedExperience.expInCurrentLevel;
  const requiredExpInCurrentLevel =
    calculatedExperience.requiredExpInCurrentLevel;
  const expPercentage = calculatedExperience.percentage;

  // 유저 OAuth 정보
  const name = "허세령";
  const social = "네이버";
  const email = userInfo.email;

  // 아바타
  const avatar: AvatarType = {
    skin: userInfo.skin,
    eyes: userInfo.eyes,
    mask: userInfo.mask,
  };

  useEffect(() => {
    setNickname(userInfo.nickname);
  }, [userInfo]);

  // 모달 설정
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => {
    setTempNickname(nickname);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setTempNickname(nickname);
  };

  // 닉네임 설정
  const nicknameMutation = useMutation({
    mutationFn: changeNickname,
    onSuccess: () => {
      setNickname(tempNickname);
      setUserInfo((userInfo) => ({
        ...userInfo,
        nickname: tempNickname,
      }));
      queryClient.invalidateQueries({ queryKey: ["userInfo"] });
      closeModal();
    },
    onError: (error) => {
      console.error("닉네임 변경 실패:", error);
    },
  });

  // 닉네임 입력 핸들러
  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempNickname(e.target.value);
  };

  // 닉네임 저장 핸들러
  const handleSaveNickname = () => {
    nicknameMutation.mutate(tempNickname);
  };

  return (
    <div>
      <Container>
        <AvatarContainer>
          <Avatar avatar={avatar} size={8} />
        </AvatarContainer>
        <ProfileInfoContainer>
          <NicknameContainer>
            <div>
              Lv {level} {nickname}
            </div>
            <EditIcon onClick={openModal} />
            <Modal
              isOpen={isModalOpen}
              onClose={closeModal}
              title="닉네임 수정"
            >
              <NicknameEditInput
                type="text"
                value={tempNickname}
                onChange={handleNicknameChange}
              />
              <ButtonContainer>
                <SaveButton
                  onClick={handleSaveNickname}
                  disabled={tempNickname === nickname}
                >
                  저장
                </SaveButton>
              </ButtonContainer>
            </Modal>
          </NicknameContainer>
          <ExperienceContainer>
            <ExperienceBarContainer>
              <ExperienceBarFill width={expPercentage} />
            </ExperienceBarContainer>
            <ExperienceText>{`${expInCurrentLevel} / ${requiredExpInCurrentLevel}`}</ExperienceText>
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

const AvatarContainer = styled.div`
  width: 100%;
  height: 8rem;
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

const NicknameEditInput = styled.input`
  display: block;
  text-align: center;
  width: 100%;
  max-width: 200px;

  margin: 0 auto 2rem;
  padding: 0.25rem;

  background-color: ${(props) => props.theme.colors.cardBackground};
  box-sizing: border-box;
  outline: none;
  border: none;
  border-bottom: 2px solid ${(props) => props.theme.colors.text01};
  font-size: 1.25rem;
  &:focus {
    border-bottom-color: ${(props) => props.theme.colors.primary};
  }
`;

// 모달 버튼
const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const CustomButton = styled.button`
  padding: 0.5rem 1rem;
  background: none;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
`;

const SaveButton = styled(CustomButton)`
  color: white;
  background-color: ${(props) => props.theme.colors.primary};
  &:hover {
    background-color: ${(props) => props.theme.colors.primaryPress};
  }
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
